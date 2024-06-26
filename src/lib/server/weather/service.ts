import { error, fail } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { Client } from '@googlemaps/google-maps-services-js';

import { MODEM_SERVICE_TYPE } from '$lib/models/modem';
import type { ServiceActionFailure } from '$lib/models/service';
import { clamp, wrap } from '$lib/counter';
import {
	WEATHER_SERVICE_TYPE,
	WEATHER_SERVICE_ACTIONS,
	ICON_MAP,
	type WeatherAlert,
	type WeatherServiceConfig,
	type WeatherForecast,
	type WeatherServiceAction,
	type WeatherServiceConfigData,
	type WeatherServiceDailyData,
	type WeatherLocation,
	type WeatherServiceHourlyData,
	type WeatherServiceAlertsData
} from '$lib/models/weather';

import { Cache } from '../Cache';
import { ModemService } from '../modem/service';
import serviceManager from '../services';
import {
	BaseService,
	type ServiceActions,
	type ServiceGetDataOptions,
	type ServiceSetDataOptions
} from '../BaseService';

interface CacheData {
	ts: Date;
	location: WeatherLocation;
	daily: WeatherForecast[];
	hourly: WeatherForecast[];
	alerts: WeatherAlert[];
}

const ENABLED = env.WEATHER_ENABLED === '1';
const GOOGLE_KEY = env.GOOGLE_KEY;
const FORECAST_URL = `https://api.openweathermap.org/data/3.0/onecall?lang=de&units=metric&exclude=current,minutely`;
const GEOCODE_URL = `https://api.openweathermap.org/geo/1.0/reverse?limit=3`;
const ICON_PREFIX = '/icons/';
const ICON_SUFFIX = '.png';

export class WeatherService extends BaseService<WeatherServiceAction, WeatherServiceConfig> {
	public static readonly actions = WEATHER_SERVICE_ACTIONS;
	public override readonly type = WEATHER_SERVICE_TYPE;

	protected readonly client = new Client({});
	protected readonly cache: Cache<CacheData> = new Cache(this.logger);
	protected lastPage: number = 0;

	protected getDefaultConfig(): WeatherServiceConfig {
		return {
			modemService: '',
			useGeo: true,
			useGps: true,
			lat: 47.38,
			lng: 8.64,
			minDiff: 1000,
			apiKey: '',
			itemsPerPage: 7
		};
	}

	protected getActions(): ServiceActions<WeatherServiceAction> {
		return {
			config: {
				get: this.getConfig.bind(this),
				set: this.setConfig.bind(this)
			},
			daily: {
				get: this.getDaily.bind(this)
			},
			hourly: {
				get: this.getHourly.bind(this)
			},
			alerts: {
				get: this.getAlerts.bind(this)
			}
		};
	}

	private checkSetup(checkConfig = true) {
		if (!ENABLED) {
			error(400, `Weather is disabled`);
		}

		if (checkConfig && !this.config.apiKey) {
			error(400, 'Invalid weather config');
		}
	}

	public async getConfig(_: ServiceGetDataOptions): Promise<WeatherServiceConfigData> {
		this.checkSetup(false);

		return {
			ts: new Date(),
			type: 'config',
			config: this.config,
			modems: serviceManager.getInstances(MODEM_SERVICE_TYPE)
		};
	}

	public async setConfig({ form }: ServiceSetDataOptions): Promise<void | ServiceActionFailure> {
		const modemServiceName = form.get('modemService');
		if (typeof modemServiceName !== 'string') {
			return fail(400, { message: 'Invalid modem service' });
		}

		const modemService = modemServiceName ? serviceManager.getByName(modemServiceName).name : '';

		const useGps = form.get('useGps') === 'on';
		const useGeo = form.get('useGeo') === 'on';

		const lat = Number(form.get('lat'));
		if (!isFinite(lat)) {
			return fail(400, { message: 'Invalid latitude' });
		}

		const lng = Number(form.get('lng'));
		if (!isFinite(lng)) {
			return fail(400, { message: 'Invalid longitude' });
		}

		const minDiff = Number(form.get('minDiff'));
		if (!isFinite(minDiff)) {
			return fail(400, { message: 'Invalid min diff' });
		}

		const apiKey = form.get('apiKey');
		if (typeof apiKey !== 'string') {
			return fail(400, { message: 'Invalid api key' });
		}

		const itemsPerPage = Number(form.get('itemsPerPage'));
		if (!isFinite(itemsPerPage)) {
			return fail(400, { message: 'Invalid number of items per page' });
		}

		// Save config before testing it
		this.config.modemService = modemService;
		this.config.useGeo = useGeo;
		this.config.useGps = useGps;
		this.config.lat = lat;
		this.config.lng = lng;
		this.config.minDiff = minDiff;
		this.config.apiKey = apiKey;
		this.config.itemsPerPage = itemsPerPage;

		// Test using supplied base cooridnates
		const forecastUrl = `${FORECAST_URL}&appid=${apiKey}&lat=${lat}&lon=${lng}`;
		const res = await fetch(forecastUrl);
		if (res.status !== 200) {
			return fail(400, { message: 'Could not access weather' });
		}
	}

	public async getDaily(options: ServiceGetDataOptions): Promise<WeatherServiceDailyData> {
		this.checkSetup();

		const data = await this.getData(options);

		const [daily] = clamp(data.daily.length, 0, this.config.itemsPerPage, data.daily);

		return {
			ts: data.ts,
			type: 'daily',
			location: data.location,
			daily
		};
	}

	public async getHourly(options: ServiceGetDataOptions): Promise<WeatherServiceHourlyData> {
		this.checkSetup();

		const data = await this.getData(options);

		const [hourly] = clamp(data.hourly.length, 0, this.config.itemsPerPage, data.hourly);

		return {
			ts: data.ts,
			type: 'hourly',
			location: data.location,
			hourly
		};
	}

	public async getAlerts(options: ServiceGetDataOptions): Promise<WeatherServiceAlertsData> {
		this.checkSetup();

		const data = await this.getData(options);

		const pageStr = options.url.searchParams.get('page');
		let page = Number(pageStr);
		if (pageStr === null && options?.embedded) {
			page = this.lastPage + 1;
		} else if (!isFinite(page)) {
			page = 0;
		}
		this.lastPage = page;

		const [[alert], prevPage, nextPage] = wrap(data.alerts.length, page, 1, data.alerts);
		if (!alert) {
			error(404, 'No weather alerts');
		}

		return {
			ts: data.ts,
			type: 'alerts',
			location: data.location,
			prevPage,
			nextPage,
			alert
		};
	}

	private async getData(options: ServiceGetDataOptions) {
		const forceUpdate = options.url.searchParams.has('force');

		return this.cache.with(
			{
				key: this.config.lat + '-' + this.config.lng,
				force: forceUpdate,
				resultCacheTime: this.config.resultCacheTime,
				errorCacheTime: this.config.errorCacheTime
			},
			async (prevData) => {
				let location = prevData?.location ?? { lat: this.config.lat, lng: this.config.lng };
				let lat = location.lat;
				let lng = location.lng;

				if (this.config.useGps || this.config.useGeo) {
					const modem = serviceManager.getByName<ModemService>(this.config.modemService);
					const modemData = await modem.getData(options).catch(() => null);
					if (modemData) {
						const info = modemData.info;
						if (this.config.useGps && info.gps) {
							this.logger.debug('Using modem gps location', info.gps);
							lat = info.gps.lat;
							lng = info.gps.lng;
						} else if (this.config.useGeo && info.geo) {
							this.logger.debug('Using modem geo location', info.geo);
							lat = info.geo.lat;
							lng = info.geo.lng;
						}
					}
				}

				const forecastUrl = `${FORECAST_URL}&appid=${this.config.apiKey}&lat=${lat}&lon=${lng}`;
				const res = await fetch(forecastUrl);
				const body = await res.json();

				const newLat: number = body.lat;
				const newLng: number = body.lon;
				let place: string | undefined = prevData?.location.place;

				const dist = this.distance(newLat, newLng, lat, lng);
				if (!place || dist > this.config.minDiff) {
					// reset in case we moved, so we don't show the old location in case we can't find the new one
					place = undefined;

					this.logger.info('Moved', dist, 'meters, recalculating location');

					const geocodeUrl = `${GEOCODE_URL}&appid=${this.config.apiKey}&lat=${newLat}&lon=${newLng}`;
					const res = await fetch(geocodeUrl).catch(() => null);
					const body = res ? await res.json() : null;
					const entry = body?.[0];

					if (entry) {
						place = `${entry.name}, ${entry.state}, ${entry.country}`;
					} else {
						this.logger.debug('Could not find place, trying google geocode...');
						const { data: geoData } = await this.client.reverseGeocode({
							params: {
								key: GOOGLE_KEY,
								latlng: { lat: newLat, lng: newLng }
							}
						});
						const addr = geoData.results?.find((r) => r.types.some((t) => t !== 'plus_code'));
						if (addr) {
							place = addr?.formatted_address;
						} else {
							this.logger.debug('Unknown place');
						}
					}

					lat = newLat;
					lng = newLng;
					location = { lat, lng, place };
					// TODO: await writeFile(CACHE_FILE, JSON.stringify({ lat, lng, place: place }), 'utf-8');
				} else {
					this.logger.debug('Weather location moved by', dist, 'meters');
				}

				const alerts: WeatherAlert[] = [];
				if (body.alerts) {
					for (const alert of body.alerts) {
						alerts.push({
							sender: alert.sender_name,
							event: alert.event,
							start: new Date(alert.start * 1000),
							end: new Date(alert.end * 1000),
							content: alert.description,
							tags: alert.tags
						});
					}
				}

				const hourly: WeatherForecast[] = [];
				for (const forecast of body.hourly) {
					hourly.push({
						ts: new Date(forecast.dt * 1000),
						img: this.getIcon(forecast.weather[0].id),
						feelsLike: forecast.feels_like
					});
				}

				const daily: WeatherForecast[] = [];
				for (const forecast of body.daily) {
					daily.push({
						ts: new Date(forecast.dt * 1000),
						img: this.getIcon(forecast.weather[0].id),
						feelsLike: forecast.feels_like.day
					});
				}

				return {
					ts: new Date(),
					location,
					alerts,
					hourly,
					daily
				};
			}
		);
	}

	private distance(lat1: number, lng1: number, lat2: number, lng2: number) {
		const R = 6378.137; // Radius of earth in KM
		const dLat = (lat2 * Math.PI) / 180 - (lat1 * Math.PI) / 180;
		const dLon = (lng2 * Math.PI) / 180 - (lng1 * Math.PI) / 180;
		const a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos((lat1 * Math.PI) / 180) *
				Math.cos((lat2 * Math.PI) / 180) *
				Math.sin(dLon / 2) *
				Math.sin(dLon / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		const d = R * c;
		return d * 1000; // meters
	}

	private getIcon(id: number) {
		return ICON_PREFIX + ICON_MAP[id] + ICON_SUFFIX;
	}
}

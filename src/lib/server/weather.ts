import { error, fail } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { Client } from '@googlemaps/google-maps-services-js';

import { clamp, wrap } from '$lib/counter';
import {
	WEATHER_SERVICE_TYPE,
	WEATHER_SERVICE_ACTIONS,
	ICON_MAP,
	type WeatherAlert,
	type WeatherServiceConfig,
	type WeatherForecast,
	type WeatherLocation
} from '$lib/models/weather';

import { Cache } from './cache';
import { BaseService } from './service';

interface CacheData {
	ts: Date;
	location: WeatherLocation;
	daily: WeatherForecast[];
	hourly: WeatherForecast[];
	alerts: WeatherAlert[];
}

const ENABLED = env.WEATHER_ENABLED === '1';
const FORECAST_URL = `https://api.openweathermap.org/data/3.0/onecall?lang=de&units=metric&exclude=current,minutely`;
const GEOCODE_URL = `https://api.openweathermap.org/geo/1.0/reverse?limit=3`;
const ICON_PREFIX = '/icons/';
const ICON_SUFFIX = '.png';

export class WeatherService extends BaseService<WeatherServiceConfig> {
	public static readonly actions = WEATHER_SERVICE_ACTIONS;
	public override readonly type = WEATHER_SERVICE_TYPE;

	protected readonly client = new Client({});
	protected readonly cache: Cache<CacheData> = new Cache(this.logger);
	protected lastPage: number = 0;

	protected getDefaultConfig(): WeatherServiceConfig {
		return {
			lat: 47.38,
			lng: 8.64,
			minDiff: 1000,
			apiKey: '',
			googleKey: '',
			itemsPerPage: 7
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

	public async getConfig() {
		this.checkSetup(false);

		return this.config;
	}

	public async setConfig({
		lat,
		lng,
		minDiff,
		apiKey,
		googleKey,
		itemsPerPage,
		resultCacheTime,
		errorCacheTime
	}: {
		lat: number;
		lng: number;
		minDiff: number;
		apiKey: string;
		googleKey: string;
		itemsPerPage: number;
		resultCacheTime: number;
		errorCacheTime: number;
	}) {
		// Test using supplied base cooridnates
		const forecastUrl = `${FORECAST_URL}&appid=${apiKey}&lat=${lat}&lon=${lng}`;
		const res = await fetch(forecastUrl);
		if (res.status !== 200) {
			return fail(400, { message: 'Could not access weather' });
		}

		// Save config before testing it
		this.config.lat = lat;
		this.config.lng = lng;
		this.config.minDiff = minDiff;
		this.config.apiKey = apiKey;
		this.config.googleKey = googleKey;
		this.config.itemsPerPage = itemsPerPage;
		this.config.resultCacheTime = resultCacheTime;
		this.config.errorCacheTime = errorCacheTime;
	}

	public async getDaily(options: { forceUpdate?: boolean }) {
		this.checkSetup();

		const data = await this.getData(options);

		const [daily] = clamp(data.daily.length, 0, this.config.itemsPerPage, data.daily);

		return {
			ts: data.ts,
			location: data.location,
			daily
		};
	}

	public async getHourly(options: { forceUpdate?: boolean }) {
		this.checkSetup();

		const data = await this.getData(options);

		const [hourly] = clamp(data.hourly.length, 0, this.config.itemsPerPage, data.hourly);

		return {
			ts: data.ts,
			location: data.location,
			hourly
		};
	}

	public async getAlerts({
		page,
		embedded,
		forceUpdate
	}: {
		page?: number | null;
		embedded?: boolean;
		forceUpdate?: boolean;
	}) {
		this.checkSetup();

		const data = await this.getData({ forceUpdate });

		if (data.alerts.length === 0 && embedded) {
			error(404, 'No weather alerts');
		}

		if (typeof page !== 'number') {
			page = this.lastPage + 1;
		}

		const [[alert], prevPage, nextPage, index] = wrap(data.alerts.length, page, 1, data.alerts);
		this.lastPage = index;

		return {
			ts: data.ts,
			location: data.location,
			prevPage,
			nextPage,
			alert
		};
	}

	private async getData({ forceUpdate }: { forceUpdate?: boolean }) {
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
								key: this.config.googleKey,
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

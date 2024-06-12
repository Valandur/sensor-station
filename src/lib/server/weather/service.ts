import { error, fail } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { Client } from '@googlemaps/google-maps-services-js';

import type { ServiceActionFailure } from '$lib/models/service';
import {
	ICON_MAP,
	WEATHER_SERVICE_TYPE,
	type WeatherAlert,
	type WeatherServiceConfig,
	type WeatherServiceData,
	type WeatherForecast,
	type WeatherServiceInstance,
	type WeatherServiceAction,
	WEATHER_SERVICE_ACTIONS
} from '$lib/models/weather';

import { BaseService } from '../BaseService';
import { getData } from '../modem/data';

const ENABLED = env.WEATHER_ENABLED === '1';
const GOOGLE_KEY = env.GOOGLE_KEY;
const FORECAST_URL = `https://api.openweathermap.org/data/3.0/onecall?lang=de&units=metric&exclude=current,minutely`;
const GEOCODE_URL = `https://api.openweathermap.org/geo/1.0/reverse?limit=3`;
const ICON_PREFIX = '/icons/';
const ICON_SUFFIX = '.png';

class WeatherService extends BaseService<
	WeatherServiceConfig,
	WeatherServiceData,
	WeatherServiceAction
> {
	public override readonly type = WEATHER_SERVICE_TYPE;
	public override readonly actions = WEATHER_SERVICE_ACTIONS;

	private client = new Client({});

	public constructor() {
		super('WEATHER');
	}

	public override async getData(
		instance: WeatherServiceInstance,
		action: WeatherServiceAction,
		forceUpdate: boolean = false
	): Promise<WeatherServiceData | null> {
		const { config } = instance;

		if (!ENABLED) {
			error(400, {
				message: `Weather is disabled`,
				key: 'weather.disabled'
			});
		}
		if (action === 'config') {
			return null;
		}
		if (typeof config.lat !== 'number' || typeof config.lng !== 'number' || !config.apiKey) {
			error(400, {
				key: 'weather.config.invalid',
				message: 'Invalid weather config'
			});
		}

		return this.cache.with(
			{
				key: config.lat + '-' + config.lng,
				force: forceUpdate,
				resultCacheTime: config.resultCacheTime,
				errorCacheTime: config.errorCacheTime
			},
			async (prevData) => {
				let location = prevData?.location ?? { lat: config.lat, lng: config.lng };
				let lat = location.lat;
				let lng = location.lng;

				if (config.useGps || config.useGeo) {
					const modemData = await getData().catch(() => null);
					if (modemData) {
						if (config.useGps && modemData.gps) {
							this.logger.debug('Using modem gps location', modemData.gps);
							lat = modemData.gps.lat;
							lng = modemData.gps.lng;
						} else if (config.useGeo && modemData.geo) {
							this.logger.debug('Using modem geo location', modemData.geo);
							lat = modemData.geo.lat;
							lng = modemData.geo.lng;
						}
					}
				}

				const forecastUrl = `${FORECAST_URL}&appid=${config.apiKey}&lat=${lat}&lon=${lng}`;
				const res = await fetch(forecastUrl);
				const body = await res.json();

				const newLat: number = body.lat;
				const newLng: number = body.lon;
				let place: string | undefined = prevData?.location.place;

				const dist = this.distance(newLat, newLng, lat, lng);
				if (!place || dist > config.minDiff) {
					// reset in case we moved, so we don't show the old location in case we can't find the new one
					place = undefined;

					this.logger.info('Moved', dist, 'meters, recalculating location');

					const geocodeUrl = `${GEOCODE_URL}&appid=${config.apiKey}&lat=${newLat}&lon=${newLng}`;
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

				/*if (dev && alerts.length === 0) {
					this.logger.warn('Using dev mock data');
					alerts.push(...getMockAlerts());
				}*/

				return {
					ts: new Date(),
					instance,
					location,
					alerts,
					hourly,
					daily
				};
			}
		);
	}

	public async setData(
		instance: WeatherServiceInstance,
		action: WeatherServiceAction,
		config: FormData
	): Promise<void | ServiceActionFailure> {
		if (action !== 'config') {
			error(400, { key: 'weather.action.invalid', message: 'Invalid action' });
		}

		const useGps = config.get('useGps') === 'on';
		const useGeo = config.get('useGeo') === 'on';

		const lat = Number(config.get('lat'));
		if (!isFinite(lat)) {
			return fail(400, { key: 'weather.lat.invalid', message: 'Invalid latitude' });
		}

		const lng = Number(config.get('lng'));
		if (!isFinite(lng)) {
			return fail(400, { key: 'weather.lng.invalid', message: 'Invalid longitude' });
		}

		const minDiff = Number(config.get('minDiff'));
		if (!isFinite(minDiff)) {
			return fail(400, { key: 'weather.minDiff.invalid', message: 'Invalid min diff' });
		}

		const apiKey = config.get('apiKey');
		if (typeof apiKey !== 'string') {
			return fail(400, { key: 'weather.apiKey.invalid', message: 'Invalid api key' });
		}

		// Save config before testing it
		instance.config = {
			useGps,
			useGeo,
			lat,
			lng,
			minDiff,
			apiKey
		};

		// Test using supplied base cooridnates
		const forecastUrl = `${FORECAST_URL}&appid=${apiKey}&lat=${lat}&lon=${lng}`;
		const res = await fetch(forecastUrl);
		if (res.status !== 200) {
			return fail(400, {
				key: 'weather.response.statusNot200',
				message: 'Could not access weather'
			});
		}
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

export default new WeatherService();

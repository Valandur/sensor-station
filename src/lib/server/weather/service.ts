import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { Client } from '@googlemaps/google-maps-services-js';

import {
	ICON_MAP,
	type WeatherAlert,
	type WeatherServiceConfig,
	type WeatherServiceData,
	type WeatherForecast
} from '$lib/models/weather';

import { BaseService } from '../BaseService';
import { getData } from '../modem/data';

export const WEATHER_TYPE = 'weather';
const ENABLED = env.WEATHER_ENABLED === '1';
const GOOGLE_KEY = env.GOOGLE_KEY;
const CACHE_FILE = 'data/weather.json';
const FORECAST_URL = `https://api.openweathermap.org/data/3.0/onecall?lang=de&units=metric&exclude=current,minutely`;
const GEOCODE_URL = `https://api.openweathermap.org/geo/1.0/reverse?limit=3`;
const ICON_PREFIX = '/icons/';
const ICON_SUFFIX = '.png';

class WeatherService extends BaseService<WeatherServiceConfig, WeatherServiceData> {
	public readonly type: string = 'weather';

	private client = new Client({});

	public constructor() {
		super('WEATHER');
	}

	public override async get(
		config: WeatherServiceConfig,
		forceUpdate = false
	): Promise<WeatherServiceData> {
		if (!ENABLED) {
			throw error(400, {
				message: `Weather is disabled`,
				key: 'weather.disabled'
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
					location,
					alerts,
					hourly,
					daily
				};
			}
		);
	}

	public validate(config: FormData): Promise<WeatherServiceConfig> {
		throw new Error('Method not implemented.');
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

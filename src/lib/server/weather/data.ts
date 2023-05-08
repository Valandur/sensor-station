import { error } from '@sveltejs/kit';
import { parseISO } from 'date-fns';
import { readFile, writeFile } from 'node:fs/promises';
import superagent from 'superagent';

import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';

import { BaseCache } from '$lib/models/BaseCache';
import { BaseLogger } from '$lib/models/BaseLogger';
import { getData as getModemData } from '$lib/server/modem/data';
import type { WeatherAlert } from '$lib/models/WeatherAlert';
import type { WeatherData } from '$lib/models/WeatherData';
import type { WeatherForecast } from '$lib/models/WeatherForecast';
import type { WeatherLocation } from '$lib/models/WeatherLocation';
import type { WeatherPlace } from '$lib/models/WeatherPlace';

import { IconMap } from './IconMap';

const ENABLED = env.WEATHER_ENABLED === '1';
const CACHE_TIME = Number(env.WEATHER_CACHE_TIME);
const BASE_LAT = Number(env.WEATHER_LAT);
const BASE_LNG = Number(env.WEATHER_LNG);
const MIN_DIFF = Number(env.WEATHER_MIN_DIFF);
const API_KEY = env.WEATHER_API_KEY;
const CACHE_FILE = 'data/weather.json';
const FORECAST_URL = `https://api.openweathermap.org/data/3.0/onecall?lang=de&units=metric&exclude=current,minutely`;
const GEOCODE_URL = `https://api.openweathermap.org/geo/1.0/reverse?limit=3`;
const ICON_PREFIX = '/icons/';
const ICON_SUFFIX = '.png';

const logger = new BaseLogger('WEATHER');
const cache = new BaseCache<WeatherData>(logger, CACHE_TIME);

let location: WeatherLocation = JSON.parse(
	await readFile(CACHE_FILE, 'utf-8').catch(() => '{ lat: 0, lng: 0 }')
);

export async function getData(forceUpdate = false) {
	return cache.withDefault(forceUpdate, async () => {
		if (!ENABLED) {
			throw error(400, {
				message: `Weather is disabled`,
				key: 'weather.disabled'
			});
		}

		let latitude = BASE_LAT;
		let longitude = BASE_LNG;

		const modemData = await getModemData().catch(() => null);
		if (modemData && modemData.lat && modemData.lng) {
			logger.debug('Using modem location', modemData.lat, modemData.lng);
			latitude = modemData.lat;
			longitude = modemData.lng;
		}

		const forecastUrl = `${FORECAST_URL}&appid=${API_KEY}&lat=${latitude}&lon=${longitude}`;
		const { body } = await superagent.get(forecastUrl);

		const lat: number = body.lat;
		const lng: number = body.lon;
		let place: WeatherPlace | undefined = location?.place;

		const dist = distance(lat, lng, location.lat, location.lng);
		if (!location.place || dist > MIN_DIFF) {
			logger.info('Moved', dist, 'meters, recalculating location');

			const geocodeUrl = `${GEOCODE_URL}&appid=${API_KEY}&lat=${lat}&lon=${lng}`;
			const { body } = await superagent.get(geocodeUrl).catch(() => ({ body: [] }));
			const result = body[0];
			place = result
				? { name: result.name, state: result.state, country: result.country }
				: undefined;

			await writeFile(CACHE_FILE, JSON.stringify({ lat: lat, lng: lng, place: place }), 'utf-8');
		} else {
			logger.debug(
				'Weather location moved by',
				distance(lat, lng, location.lat, location.lng),
				'meters'
			);
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
				img: getIcon(forecast.weather[0].id),
				feelsLike: forecast.feels_like
			});
		}

		const daily: WeatherForecast[] = [];
		for (const forecast of body.daily) {
			daily.push({
				ts: new Date(forecast.dt * 1000),
				img: getIcon(forecast.weather[0].id),
				feelsLike: forecast.feels_like.day
			});
		}

		if (dev && alerts.length === 0) {
			logger.warn('Using dev mock data');
			alerts.push(...getMockAlerts());
		}

		location = { lat, lng, place };
		return {
			ts: new Date(),
			location,
			alerts,
			hourly,
			daily
		};
	});
}

function getIcon(id: number) {
	return ICON_PREFIX + IconMap[id] + ICON_SUFFIX;
}

function distance(lat1: number, lng1: number, lat2: number, lng2: number) {
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

function getMockAlerts(): WeatherAlert[] {
	return [
		{
			sender: 'MeteoSwiss',
			event: 'Yellow Wind Warning',
			start: parseISO('2023-03-31T07:00:00.000Z'),
			end: parseISO('2023-03-31T19:00:00.000Z'),
			content:
				'- Highest wind gusts in exposed locations: 70 - 90 km/h, above 1000 m 80 - 110 km/h\n- Main wind direction southwest to west',
			tags: ['Wind']
		},
		{
			sender: 'MeteoSwiss',
			event: 'Orange Wind Warning',
			start: parseISO('2023-03-31T06:00:00.000Z'),
			end: parseISO('2023-03-31T19:00:00.000Z'),
			content:
				'- Highest wind gusts in exposed locations: 80 - 110 km/h, above 1000 m  100 - 140 km/h\n- Main wind direction: west to southwest\n- Peak phase of the event: Fri 12 - Fri 17\n- Intensifying conditions: -',
			tags: ['Wind']
		}
	];
}

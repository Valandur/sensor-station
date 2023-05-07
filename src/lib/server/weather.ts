import { dev } from '$app/environment';
import { differenceInSeconds, parseISO } from 'date-fns';
import { error } from '@sveltejs/kit';
import superagent from 'superagent';

import { env } from '$env/dynamic/private';

import { getIcon } from '$lib/models/WeatherIcon';
import { Logger } from '$lib/logger';
import type { WeatherAlert } from '$lib/models/WeatherAlert';
import type { WeatherForecast } from '$lib/models/WeatherForecast';

import { getStatus } from './modem';

export const ENABLED = env.WEATHER_ENABLED === '1';
const CACHE_TIME = Number(env.WEATHER_CACHE_TIME);
const BASE_LAT = Number(env.WEATHER_LAT);
const BASE_LNG = Number(env.WEATHER_LNG);
const API_KEY = env.WEATHER_API_KEY;
const URL = `https://api.openweathermap.org/data/3.0/onecall?lang=de&units=metric&exclude=current,minutely`;

const logger = new Logger('WEATHER');

let latitude = BASE_LAT;
let longitude = BASE_LNG;
let alerts: WeatherAlert[] = [];
let hourly: WeatherForecast[] = [];
let daily: WeatherForecast[] = [];
let cachedAt = new Date(0);

export async function getAlerts(): Promise<[number, number, WeatherAlert[]]> {
	const { latitude, longitude, alerts } = await getWeather();
	return [latitude, longitude, alerts];
}

export async function getHourly(): Promise<[number, number, WeatherForecast[]]> {
	const { latitude, longitude, hourly } = await getWeather();
	return [latitude, longitude, hourly];
}

export async function getDaily(): Promise<[number, number, WeatherForecast[]]> {
	const { latitude, longitude, daily } = await getWeather();
	return [latitude, longitude, daily];
}

async function getWeather(): Promise<Weather> {
	if (!ENABLED) {
		throw error(400, { message: 'Weather module is disabled', key: 'weather.disabled' });
	}

	if (differenceInSeconds(new Date(), cachedAt) <= CACHE_TIME) {
		logger.debug('Using cached weather');
		return { latitude, longitude, alerts, hourly, daily };
	}

	logger.debug('Updating...');
	const startTime = process.hrtime.bigint();

	try {
		let lat = BASE_LAT;
		let lng = BASE_LNG;

		const loc = await getStatus().catch(() => null);
		if (loc && loc.lat && loc.lng) {
			lat = loc.lat;
			lng = loc.lng;
		}

		const url = `${URL}&appid=${API_KEY}&lat=${lat}&lon=${lng}`;

		const newAlerts: WeatherAlert[] = [];
		const newHourly: WeatherForecast[] = [];
		const newDaily: WeatherForecast[] = [];

		const { body } = await superagent.get(url);

		if (body.alerts) {
			for (const alert of body.alerts) {
				newAlerts.push({
					sender: alert.sender_name,
					event: alert.event,
					start: new Date(alert.start * 1000),
					end: new Date(alert.end * 1000),
					content: alert.description,
					tags: alert.tags
				});
			}
		}

		for (const forecast of body.hourly) {
			newHourly.push({
				ts: new Date(forecast.dt * 1000),
				img: getIcon(forecast.weather[0].id),
				feelsLike: forecast.feels_like
			});
		}

		for (const forecast of body.daily) {
			newDaily.push({
				ts: new Date(forecast.dt * 1000),
				img: getIcon(forecast.weather[0].id),
				feelsLike: forecast.feels_like.day
			});
		}

		if (dev && newAlerts.length === 0) {
			newAlerts.push(...getMockAlerts());
		}

		latitude = lat;
		longitude = lng;
		alerts = newAlerts;
		hourly = newHourly;
		daily = newDaily;
		cachedAt = new Date();

		return { latitude, longitude, alerts, hourly, daily };
	} catch (err) {
		throw logger.toSvelteError(err);
	} finally {
		const diffTime = (process.hrtime.bigint() - startTime) / 1000000n;
		logger.info('Updated', diffTime, 'ms');
	}
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

interface Weather {
	latitude: number;
	longitude: number;
	alerts: WeatherAlert[];
	hourly: WeatherForecast[];
	daily: WeatherForecast[];
}

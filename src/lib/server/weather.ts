import { differenceInSeconds } from 'date-fns';
import { error } from '@sveltejs/kit';
import superagent from 'superagent';

import { env } from '$env/dynamic/private';

import { getIcon } from '$lib/models/WeatherIcon';
import { Logger } from '$lib/logger';
import type { WeatherAlert } from '$lib/models/WeatherAlert';
import type { WeatherForecast } from '$lib/models/WeatherForecast';

export const ENABLED = env.WEATHER_ENABLED === '1';
const CACHE_TIME = Number(env.WEATHER_CACHE_TIME);
const BASE_LAT = env.WEATHER_LAT;
const BASE_LNG = env.WEATHER_LNG;
const API_KEY = env.WEATHER_API_KEY;
const URL = `https://api.openweathermap.org/data/3.0/onecall?lang=de&units=metric&exclude=current,minutely`;

const logger = new Logger('WEATHER');

let alerts: WeatherAlert[] = [];
let hourly: WeatherForecast[] = [];
let daily: WeatherForecast[] = [];
let cachedAt = new Date(0);

export async function getAlerts(latitude?: string, longitude?: string): Promise<WeatherAlert[]> {
	const { alerts } = await getWeather(latitude, longitude);
	return alerts;
}

export async function getHourly(latitude?: string, longitude?: string): Promise<WeatherForecast[]> {
	const { hourly } = await getWeather(latitude, longitude);
	return hourly;
}

export async function getDaily(latitude?: string, longitude?: string): Promise<WeatherForecast[]> {
	const { daily } = await getWeather(latitude, longitude);
	return daily;
}

async function getWeather(latitude?: string, longitude?: string): Promise<Weather> {
	if (!ENABLED) {
		throw error(400, { message: 'Weather module is disabled', key: 'weather.disabled' });
	}

	if (differenceInSeconds(new Date(), cachedAt) <= CACHE_TIME) {
		logger.debug('Using cached weather');
		return { alerts, hourly, daily };
	}

	logger.debug('Updating...');
	const startTime = process.hrtime.bigint();

	try {
		const lat = latitude || BASE_LAT;
		const lng = longitude || BASE_LNG;
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

		alerts = newAlerts;
		hourly = newHourly;
		daily = newDaily;
		cachedAt = new Date();

		return { alerts, hourly, daily };
	} catch (err) {
		throw logger.toSvelteError(err);
	} finally {
		const diffTime = (process.hrtime.bigint() - startTime) / 1000000n;
		logger.info('Updated', diffTime, 'ms');
	}
}

interface Weather {
	alerts: WeatherAlert[];
	hourly: WeatherForecast[];
	daily: WeatherForecast[];
}

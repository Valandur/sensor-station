import { differenceInSeconds, isAfter } from 'date-fns';
import { env } from '$env/dynamic/private';
import { redirect } from '@sveltejs/kit';
import superagent from 'superagent';

import { getIcon } from '$lib/models/WeatherIcon';
import type { WeatherAlert } from '$lib/models/WeatherAlert';
import type { WeatherForecast } from '$lib/models/WeatherForecast';

import type { LayoutServerLoad } from './$types';

const ENABLED = env.WEATHER_ENABLED === '1';
const CACHE_TIME = Number(env.WEATHER_CACHE_TIME);
const BASE_LAT = env.WEATHER_LAT;
const BASE_LNG = env.WEATHER_LNG;
const API_KEY = env.WEATHER_API_KEY;
const NUM_FORECASTS = 7;
const URL = `https://api.openweathermap.org/data/3.0/onecall?lang=de&units=metric&exclude=current,minutely`;

export const load: LayoutServerLoad = async () => {
	if (!ENABLED) {
		throw redirect(302, '/screens');
	}

	const { alerts, hourly, daily } = await getWeather();

	const now = new Date();
	return {
		alerts,
		hourly: hourly
			.filter((f) => isAfter(f.ts, now))
			.filter((_, i) => i % 2 === 0)
			.slice(0, NUM_FORECASTS),
		daily: daily.slice(0, NUM_FORECASTS)
	};
};

let alerts: WeatherAlert[] = [];
let hourly: WeatherForecast[] = [];
let daily: WeatherForecast[] = [];
let cachedAt = new Date(0);

async function getWeather(latitude?: string, longitude?: string): Promise<Weather> {
	if (differenceInSeconds(new Date(), cachedAt) <= CACHE_TIME) {
		return { alerts, hourly, daily };
	}

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
}

interface Weather {
	alerts: WeatherAlert[];
	hourly: WeatherForecast[];
	daily: WeatherForecast[];
}

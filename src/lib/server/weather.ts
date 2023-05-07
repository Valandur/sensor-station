import { dev } from '$app/environment';
import { differenceInSeconds, parseISO } from 'date-fns';
import { error } from '@sveltejs/kit';
import { readFile, writeFile } from 'node:fs/promises';
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
const MIN_DIFF = Number(env.WEATHER_MIN_DIFF);
const API_KEY = env.WEATHER_API_KEY;
const CACHE_FILE = 'data/weather.json';
const FORECAST_URL = `https://api.openweathermap.org/data/3.0/onecall?lang=de&units=metric&exclude=current,minutely`;
const GEOCODE_URL = `https://api.openweathermap.org/geo/1.0/reverse?limit=3`;

const logger = new Logger('WEATHER');

let loaded = false;
let location: Location = { lat: BASE_LAT, lng: BASE_LNG };
let alerts: WeatherAlert[] = [];
let hourly: WeatherForecast[] = [];
let daily: WeatherForecast[] = [];
let cachedAt = new Date(0);

export async function getAlerts(): Promise<[Location, WeatherAlert[]]> {
	const { location, alerts } = await getWeather();
	return [location, alerts];
}

export async function getHourly(): Promise<[Location, WeatherForecast[]]> {
	const { location, hourly } = await getWeather();
	return [location, hourly];
}

export async function getDaily(): Promise<[Location, WeatherForecast[]]> {
	const { location, daily } = await getWeather();
	return [location, daily];
}

async function getWeather(): Promise<Weather> {
	if (!ENABLED) {
		throw error(400, { message: 'Weather module is disabled', key: 'weather.disabled' });
	}

	if (differenceInSeconds(new Date(), cachedAt) <= CACHE_TIME) {
		logger.debug('Using cached weather');
		return { location, alerts, hourly, daily };
	}

	logger.debug('Updating...');
	const startTime = process.hrtime.bigint();

	try {
		let lat = location.lat;
		let lng = location.lng;

		if (!loaded) {
			const data = JSON.parse(await readFile(CACHE_FILE, 'utf-8').catch(() => 'null'));
			if (data) {
				location = data;
				lat = location.lat;
				lng = location.lng;
				loaded = true;
			}
		}

		const modemInfo = await getStatus().catch(() => null);
		if (modemInfo && modemInfo.lat && modemInfo.lng) {
			logger.debug('Using modem location', modemInfo.lat, modemInfo.lng);
			lat = modemInfo.lat;
			lng = modemInfo.lng;
		}

		const newAlerts: WeatherAlert[] = [];
		const newHourly: WeatherForecast[] = [];
		const newDaily: WeatherForecast[] = [];

		const forecastUrl = `${FORECAST_URL}&appid=${API_KEY}&lat=${lat}&lon=${lng}`;
		const { body } = await superagent.get(forecastUrl);

		const newLat: number = body.lat;
		const newLng: number = body.lon;
		let newPlace: Place | undefined = location.place;

		const dist = distance(newLat, newLng, location.lat, location.lng);
		if (!location.place || dist > MIN_DIFF) {
			logger.debug('Moved', dist, 'meters, recalculating location');
			const geocodeUrl = `${GEOCODE_URL}&appid=${API_KEY}&lat=${newLat}&lon=${newLng}`;
			const { body } = await superagent.get(geocodeUrl).catch(() => ({ body: [] }));
			const result = body[0];
			newPlace = result
				? { name: result.name, state: result.state, country: result.country }
				: undefined;
			await writeFile(
				CACHE_FILE,
				JSON.stringify({ lat: newLat, lng: newLng, place: newPlace }),
				'utf-8'
			);
		}

		logger.debug(
			'Weather location moved by',
			distance(newLat, newLng, location.lat, location.lng),
			'meters'
		);

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

		location = { lat: newLat, lng: newLng, place: newPlace };
		alerts = newAlerts;
		hourly = newHourly;
		daily = newDaily;
		cachedAt = new Date();

		return { location, alerts, hourly, daily };
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

interface Weather {
	location: Location;
	alerts: WeatherAlert[];
	hourly: WeatherForecast[];
	daily: WeatherForecast[];
}

interface Location {
	lat: number;
	lng: number;
	place?: Place;
}

interface Place {
	name: string;
	state: string;
	country: string;
}

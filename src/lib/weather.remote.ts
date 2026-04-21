import { query } from '$app/server';
import * as v from 'valibot';

import manager from './server/manager';
import { WeatherService } from './server/weather';

export const getHourlyWeather = query(
	v.object({
		srv: v.string(),
		forceUpdate: v.optional(v.boolean())
	}),
	async ({ srv, forceUpdate = false }) => {
		return manager.getByName<WeatherService>(srv).getHourly({ forceUpdate });
	}
);

export const getDailyWeather = query(
	v.object({
		srv: v.string(),
		forceUpdate: v.optional(v.boolean())
	}),
	async ({ srv, forceUpdate = false }) => {
		return manager.getByName<WeatherService>(srv).getDaily({ forceUpdate });
	}
);

export const getWeatherAlerts = query(
	v.object({
		srv: v.string(),
		page: v.optional(v.number()),
		forceUpdate: v.optional(v.boolean())
	}),
	async ({ srv, page, forceUpdate = false }) => {
		return manager.getByName<WeatherService>(srv).getAlerts({ forceUpdate, page });
	}
);

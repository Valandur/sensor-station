import { form, query } from '$app/server';
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

export const getConfig = query(v.string(), (srv) => {
	return manager.getByName<WeatherService>(srv).getConfig();
});

export const configForm = form(
	v.object({
		srv: v.string(),
		apiKey: v.string(),
		googleKey: v.string(),
		lat: v.number(),
		lng: v.number(),
		itemsPerPage: v.number(),
		minDiff: v.number(),
		resultCacheTime: v.pipe(v.number(), v.minValue(0)),
		errorCacheTime: v.pipe(v.number(), v.minValue(0))
	}),
	async ({
		srv,
		apiKey,
		googleKey,
		lat,
		lng,
		itemsPerPage,
		minDiff,
		resultCacheTime,
		errorCacheTime
	}) => {
		await manager
			.getByName<WeatherService>(srv)
			.setConfig({
				apiKey,
				googleKey,
				lat,
				lng,
				itemsPerPage,
				minDiff,
				resultCacheTime,
				errorCacheTime
			});
		await manager.save();
		void getConfig(srv).refresh();
	}
);

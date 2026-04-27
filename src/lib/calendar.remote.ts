import { form, query } from '$app/server';
import * as v from 'valibot';

import manager from './server/manager';
import { CalendarService } from './server/calendar';

export const getEvents = query(
	v.object({
		srv: v.string(),
		page: v.optional(v.nullable(v.number()))
	}),
	async ({ srv, page }) => {
		return manager.getByName<CalendarService>(srv).getEvents({ page });
	}
);

export const getConfig = query(v.string(), (srv) => {
	return manager.getByName<CalendarService>(srv).getConfig();
});

export const configForm = form(
	v.object({
		srv: v.string(),
		calendarId: v.string(),
		serviceEmail: v.pipe(v.string(), v.email()),
		privateKey: v.string(),
		itemsPerPage: v.pipe(v.number(), v.minValue(1), v.maxValue(10)),
		resultCacheTime: v.pipe(v.number(), v.minValue(0)),
		errorCacheTime: v.pipe(v.number(), v.minValue(0))
	}),
	async ({
		srv,
		calendarId,
		serviceEmail,
		privateKey,
		itemsPerPage,
		resultCacheTime,
		errorCacheTime
	}) => {
		await manager.getByName<CalendarService>(srv).setConfig({
			calendarId,
			serviceEmail,
			privateKey,
			itemsPerPage,
			resultCacheTime,
			errorCacheTime
		});
		await manager.save();
		void getConfig(srv).refresh();
	}
);

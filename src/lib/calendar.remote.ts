import { form, query } from '$app/server';
import * as v from 'valibot';

import manager from './server/manager';
import { CalendarService } from './server/calendar';

export const getEvents = query(
	v.object({
		srv: v.string(),
		page: v.number()
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
		serviceEmail: v.string(),
		privateKey: v.string(),
		itemsPerPage: v.number()
	}),
	async ({ srv, calendarId, serviceEmail, privateKey, itemsPerPage }) => {
		await manager
			.getByName<CalendarService>(srv)
			.setConfig({ calendarId, serviceEmail, privateKey, itemsPerPage });
		await manager.save();
		void getConfig(srv).refresh();
	}
);

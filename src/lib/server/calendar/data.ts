import { error } from '@sveltejs/kit';
import { google } from 'googleapis';
import { parseISO } from 'date-fns';

import { env } from '$env/dynamic/private';

import { BaseCache } from '$lib/models/BaseCache';
import { BaseLogger } from '$lib/models/BaseLogger';
import type { CalendarData } from '$lib/models/CalendarData';

const ENABLED = env.CALENDAR_ENABLED === '1';
const CACHE_TIME = Number(env.CALENDAR_CACHE_TIME);
const CALENDAR_ID = env.CALENDAR_GOOGLE_CALENDAR_ID;
const PRIVATE_KEY = env.CALENDAR_GOOGLE_PRIVATE_KEY;
const SERVICE_EMAIL = env.CALENDAR_GOOGLE_SERVICE_EMAIL;
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

const logger = new BaseLogger('CALENDAR');
const cache = new BaseCache<CalendarData>(logger, CACHE_TIME);

export async function getData(forceUpdate = false) {
	if (!ENABLED) {
		throw error(400, {
			message: `Calendar is disabled`,
			key: 'calendar.disabled'
		});
	}

	return cache.withDefault(forceUpdate, async () => {
		const jwtClient = new google.auth.JWT(SERVICE_EMAIL, undefined, PRIVATE_KEY, SCOPES);
		const calendar = google.calendar({ version: 'v3', auth: jwtClient });

		const res = await calendar.events.list({
			calendarId: CALENDAR_ID,
			timeMin: new Date().toISOString(),
			maxResults: 10,
			singleEvents: true,
			orderBy: 'startTime'
		});
		const items = res.data.items || [];

		const events = [];
		for (const event of items) {
			const start = event.start?.dateTime || event.start?.date;
			const end = event.end?.dateTime || event.end?.date;
			if (!start || !end || !event.summary) {
				continue;
			}

			events.push({
				tsStart: parseISO(start),
				tsEnd: parseISO(end),
				content: event.summary,
				isWholeDay: !!event.start?.date
			});
		}

		return {
			ts: new Date(),
			events
		};
	});
}

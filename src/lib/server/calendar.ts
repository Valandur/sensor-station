import { differenceInSeconds, parseISO } from 'date-fns';
import { env } from '$env/dynamic/private';
import { google } from 'googleapis';

import type { CalendarEvent } from '$lib/models/CalendarEvent';

export const ENABLED = env.CALENDAR_ENABLED === '1';
const CACHE_TIME = Number(env.CALENDAR_CACHE_TIME);
const CALENDAR_ID = env.CALENDAR_GOOGLE_CALENDAR_ID;
const PRIVATE_KEY = env.CALENDAR_GOOGLE_PRIVATE_KEY;
const SERVICE_EMAIL = env.CALENDAR_GOOGLE_SERVICE_EMAIL;
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

let events: CalendarEvent[] = [];
let cachedAt = new Date(0);

export async function getEvents(): Promise<CalendarEvent[]> {
	if (differenceInSeconds(new Date(), cachedAt) <= CACHE_TIME) {
		return events;
	}

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

	const newEvents: CalendarEvent[] = [];
	for (const event of items) {
		const start = event.start?.dateTime || event.start?.date;
		const end = event.end?.dateTime || event.end?.date;
		if (!start || !end || !event.summary) {
			continue;
		}

		newEvents?.push({
			tsStart: parseISO(start),
			tsEnd: parseISO(end),
			content: event.summary,
			isWholeDay: !!event.start?.date
		});
	}

	events = newEvents;
	cachedAt = new Date();

	return events;
}

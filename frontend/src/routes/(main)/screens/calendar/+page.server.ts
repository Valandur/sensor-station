import { differenceInSeconds, parseISO } from 'date-fns';
import { env } from '$env/dynamic/private';
import { google } from 'googleapis';
import { redirect } from '@sveltejs/kit';

import { Counter } from '$lib/counter';
import type { CalendarEvent } from '$lib/models/CalendarEvent';

import type { PageServerLoad } from './$types';

const ENABLED = env.CALENDAR_ENABLED === '1';
const CACHE_TIME = Number(env.CALENDAR_CACHE_TIME);
const CALENDAR_ID = env.CALENDAR_GOOGLE_CALENDAR_ID;
const PRIVATE_KEY = env.CALENDAR_GOOGLE_PRIVATE_KEY;
const SERVICE_EMAIL = env.CALENDAR_GOOGLE_SERVICE_EMAIL;
const MAX_ITEMS = 7;
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

const counter = new Counter();

export const load: PageServerLoad = async ({ url, parent }) => {
	if (!ENABLED) {
		throw redirect(302, '/screens');
	}

	let page = Number(url.searchParams.get('page') || '-');

	const allEvents = await getEvents();
	counter.max = allEvents.length;

	if (!isFinite(page)) {
		page = 0;
	}

	const events = allEvents.slice(page, page + MAX_ITEMS);
	const dataParent = await parent();

	return {
		events,
		nextPage: `?screen=${dataParent.index}&page=${counter.wrap(page + 1)}`,
		prevPage: `?screen=${dataParent.index}&page=${page > 0 ? page - 1 : 0}`
	};
};

let events: CalendarEvent[] = [];
let cachedAt = new Date(0);

async function getEvents(): Promise<CalendarEvent[]> {
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

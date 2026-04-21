import { error, fail } from '@sveltejs/kit';
import { google } from 'googleapis';
import { parseISO } from 'date-fns';
import { env } from '$env/dynamic/private';

import { clamp } from '$lib/counter';
import {
	CALENDAR_SERVICE_TYPE,
	CALENDAR_SERVICE_ACTIONS,
	type CalendarServiceConfig,
	type CalendarEvent
} from '$lib/models/calendar';

import { Cache } from './cache';
import { BaseService } from './service';

interface CacheData {
	ts: Date;
	events: CalendarEvent[];
}

const ENABLED = env.CALENDAR_ENABLED === '1';
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

export class CalendarService extends BaseService<CalendarServiceConfig> {
	public static readonly actions = CALENDAR_SERVICE_ACTIONS;
	public override readonly type = CALENDAR_SERVICE_TYPE;

	protected readonly cache: Cache<CacheData> = new Cache(this.logger);

	protected getDefaultConfig(): CalendarServiceConfig {
		return {
			calendarId: '',
			privateKey: '',
			serviceEmail: '',
			itemsPerPage: 6
		};
	}

	public async getConfig() {
		if (!ENABLED) {
			error(400, `Calendar is disabled`);
		}

		return {
			ts: new Date(),
			type: 'config',
			config: this.config
		};
	}

	public async setConfig({
		calendarId,
		serviceEmail,
		privateKey,
		itemsPerPage
	}: {
		calendarId: string;
		serviceEmail: string;
		privateKey: string;
		itemsPerPage: number;
	}) {
		this.config.calendarId = calendarId;
		this.config.serviceEmail = serviceEmail;
		this.config.privateKey = privateKey;
		this.config.itemsPerPage = itemsPerPage;

		const jwtClient = new google.auth.JWT({
			email: serviceEmail,
			key: privateKey,
			scopes: SCOPES
		});

		const calendar = google.calendar({ version: 'v3', auth: jwtClient });

		const res = await calendar.events.list({
			calendarId: calendarId,
			timeMin: new Date().toISOString(),
			maxResults: 10,
			singleEvents: true,
			orderBy: 'startTime'
		});

		if (res.status !== 200) {
			return fail(400, { message: 'Could not access calendar' });
		}
	}

	public async getEvents({ forceUpdate, page = 0 }: { forceUpdate?: boolean; page?: number }) {
		if (!ENABLED) {
			error(400, `Calendar is disabled`);
		}

		if (!this.config.calendarId || !this.config.serviceEmail || !this.config.privateKey) {
			error(400, 'Invalid calendar config');
		}

		const data = await this.cache.with(
			{
				key: this.config.calendarId,
				force: forceUpdate,
				resultCacheTime: this.config.resultCacheTime,
				errorCacheTime: this.config.errorCacheTime
			},
			async () => {
				const jwtClient = new google.auth.JWT({
					email: this.config.serviceEmail,
					key: this.config.privateKey,
					scopes: SCOPES
				});

				const calendar = google.calendar({ version: 'v3', auth: jwtClient });

				const res = await calendar.events.list({
					calendarId: this.config.calendarId,
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
			}
		);

		const [events, prevPage, nextPage] = clamp(
			data.events.length,
			page,
			this.config.itemsPerPage,
			data.events
		);

		return {
			ts: data.ts,
			type: 'data',
			prevPage,
			nextPage,
			events
		};
	}
}

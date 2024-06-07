import { error } from '@sveltejs/kit';
import { google } from 'googleapis';
import { parseISO } from 'date-fns';
import { env } from '$env/dynamic/private';

import {
	CALENDAR_SERVICE_TYPE,
	type CalendarServiceConfig,
	type CalendarServiceData
} from '$lib/models/calendar';

import { BaseService } from '../BaseService';

const ENABLED = env.CALENDAR_ENABLED === '1';
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

class CalendarService extends BaseService<CalendarServiceConfig, CalendarServiceData> {
	public override readonly type = CALENDAR_SERVICE_TYPE;

	public constructor() {
		super('CALENDAR');
	}

	public override async get(
		name: string,
		config: CalendarServiceConfig,
		forceUpdate = false
	): Promise<CalendarServiceData> {
		return this.cache.with(
			{
				key: config.calendarId,
				force: forceUpdate,
				resultCacheTime: config.resultCacheTime,
				errorCacheTime: config.errorCacheTime
			},
			async () => {
				if (!ENABLED) {
					error(400, {
						message: `Calendar is disabled`,
						key: 'calendar.disabled'
					});
				}

				const jwtClient = new google.auth.JWT(
					config.serviceEmail,
					undefined,
					config.privateKey,
					SCOPES
				);
				const calendar = google.calendar({ version: 'v3', auth: jwtClient });

				const res = await calendar.events.list({
					calendarId: config.calendarId,
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
					name,
					events
				};
			}
		);
	}

	public async validate(name: string, config: FormData): Promise<CalendarServiceConfig> {
		const calendarId = config.get('calendarId');
		if (typeof calendarId !== 'string') {
			throw new Error('Invalid calendar id');
		}

		const serviceEmail = config.get('serviceEmail');
		if (typeof serviceEmail !== 'string') {
			throw new Error('Invalid service email');
		}

		const privateKey = config.get('privateKey');
		if (typeof privateKey !== 'string') {
			throw new Error('Invalid private key');
		}

		const jwtClient = new google.auth.JWT(serviceEmail, undefined, privateKey, SCOPES);
		const calendar = google.calendar({ version: 'v3', auth: jwtClient });

		const res = await calendar.events.list({
			calendarId: calendarId,
			timeMin: new Date().toISOString(),
			maxResults: 10,
			singleEvents: true,
			orderBy: 'startTime'
		});
		if (res.status !== 200) {
			throw new Error(`Invalid response: ${res.status}`);
		}

		return {
			calendarId,
			serviceEmail,
			privateKey
		};
	}
}

export default new CalendarService();

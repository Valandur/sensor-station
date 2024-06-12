import { error, fail } from '@sveltejs/kit';
import { google } from 'googleapis';
import { parseISO } from 'date-fns';
import { env } from '$env/dynamic/private';

import type { ServiceActionFailure } from '$lib/models/service';
import {
	CALENDAR_SERVICE_ACTIONS,
	type CalendarServiceConfig,
	type CalendarServiceData,
	type CalendarServiceAction
} from '$lib/models/calendar';

import {
	BaseService,
	type ServiceGetDataOptions,
	type ServiceSetDataOptions
} from '../BaseService';

const ENABLED = env.CALENDAR_ENABLED === '1';
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

export class CalendarService extends BaseService<
	CalendarServiceAction,
	CalendarServiceConfig,
	CalendarServiceData
> {
	public static readonly actions = CALENDAR_SERVICE_ACTIONS;

	protected generateDefaultConfig(): CalendarServiceConfig {
		return {
			calendarId: '',
			privateKey: '',
			serviceEmail: ''
		};
	}

	public override async getData(
		action: CalendarServiceAction,
		{ url }: ServiceGetDataOptions
	): Promise<CalendarServiceData | null> {
		if (!ENABLED) {
			error(400, {
				message: `Calendar is disabled`,
				key: 'service.calendar.disabled'
			});
		}

		if (action === 'config') {
			return {
				ts: new Date(),
				name: this.name,
				type: this.type,
				action: 'config',
				config: this.config
			};
		}

		if (!this.config.calendarId || !this.config.serviceEmail || !this.config.privateKey) {
			error(400, {
				key: 'calendar.config.invalid',
				message: 'Invalid calendar config'
			});
		}

		const forceUpdate = url.searchParams.has('force');

		return this.cache.with(
			{
				key: this.config.calendarId,
				force: forceUpdate,
				resultCacheTime: this.config.resultCacheTime,
				errorCacheTime: this.config.errorCacheTime
			},
			async () => {
				const jwtClient = new google.auth.JWT(
					this.config.serviceEmail,
					undefined,
					this.config.privateKey,
					SCOPES
				);
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
					name: this.name,
					type: this.type,
					action,
					events
				};
			}
		);
	}

	public async setData(
		action: CalendarServiceAction,
		{ form }: ServiceSetDataOptions
	): Promise<void | ServiceActionFailure> {
		if (action !== 'config') {
			error(400, { key: 'calendar.action.invalid', message: 'Invalid action' });
		}

		const calendarId = form.get('calendarId');
		if (typeof calendarId !== 'string') {
			return fail(400, { key: 'calendar.calendarId.invalid', message: 'Invalid calendar id' });
		}

		const serviceEmail = form.get('serviceEmail');
		if (typeof serviceEmail !== 'string') {
			return fail(400, { key: 'calendar.serviceEmail.invalid', message: 'Invalid service email' });
		}

		const privateKey = form.get('privateKey');
		if (typeof privateKey !== 'string') {
			return fail(400, { key: 'calendar.privateKey.invalid', message: 'Invalid private key' });
		}

		this.config = {
			calendarId,
			serviceEmail,
			privateKey
		};

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
			return fail(400, {
				key: 'calendar.response.statusNot200',
				message: 'Could not access calendar'
			});
		}
	}
}

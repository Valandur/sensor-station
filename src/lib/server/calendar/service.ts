import { error, fail } from '@sveltejs/kit';
import { google } from 'googleapis';
import { parseISO } from 'date-fns';
import { env } from '$env/dynamic/private';

import { clamp } from '$lib/counter';
import type { ServiceActionFailure } from '$lib/models/service';
import {
	CALENDAR_SERVICE_TYPE,
	CALENDAR_SERVICE_ACTIONS,
	type CalendarServiceConfig,
	type CalendarServiceAction,
	type CalendarServiceConfigData,
	type CalendarServiceMainData,
	type CalendarEvent
} from '$lib/models/calendar';

import { Cache } from '../Cache';
import {
	BaseService,
	type ServiceActions,
	type ServiceGetDataOptions,
	type ServiceSetDataOptions
} from '../BaseService';

interface CacheData {
	ts: Date;
	events: CalendarEvent[];
}

const ENABLED = env.CALENDAR_ENABLED === '1';
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

export class CalendarService extends BaseService<CalendarServiceAction, CalendarServiceConfig> {
	public static readonly actions = CALENDAR_SERVICE_ACTIONS;
	public override readonly type = CALENDAR_SERVICE_TYPE;

	private readonly cache: Cache<CacheData> = new Cache(this.logger);

	protected getDefaultConfig(): CalendarServiceConfig {
		return {
			calendarId: '',
			privateKey: '',
			serviceEmail: '',
			itemsPerPage: 6
		};
	}

	protected getActions(): ServiceActions<CalendarServiceAction> {
		return {
			config: {
				get: this.getConfig.bind(this),
				set: this.setConfig.bind(this)
			},
			main: {
				get: this.getData.bind(this)
			},
			preview: {
				get: this.getData.bind(this)
			}
		};
	}

	public async getConfig(_: ServiceGetDataOptions): Promise<CalendarServiceConfigData> {
		if (!ENABLED) {
			error(400, `Calendar is disabled`);
		}

		return {
			ts: new Date(),
			type: 'config',
			config: this.config
		};
	}

	public async setConfig({ form }: ServiceSetDataOptions): Promise<void | ServiceActionFailure> {
		const calendarId = form.get('calendarId');
		if (typeof calendarId !== 'string') {
			return fail(400, { message: 'Invalid calendar id' });
		}

		const serviceEmail = form.get('serviceEmail');
		if (typeof serviceEmail !== 'string') {
			return fail(400, { message: 'Invalid service email' });
		}

		const privateKey = form.get('privateKey');
		if (typeof privateKey !== 'string') {
			return fail(400, { message: 'Invalid private key' });
		}

		const itemsPerPage = Number(form.get('itemsPerPage'));
		if (!isFinite(itemsPerPage)) {
			return fail(400, { message: 'Invalid number of items per page' });
		}

		this.config.calendarId = calendarId;
		this.config.serviceEmail = serviceEmail;
		this.config.privateKey = privateKey;
		this.config.itemsPerPage = itemsPerPage;

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
			return fail(400, { message: 'Could not access calendar' });
		}
	}

	public async getData({ url }: ServiceGetDataOptions): Promise<CalendarServiceMainData> {
		if (!ENABLED) {
			error(400, `Calendar is disabled`);
		}

		if (!this.config.calendarId || !this.config.serviceEmail || !this.config.privateKey) {
			error(400, 'Invalid calendar config');
		}

		const forceUpdate = url.searchParams.has('force');

		const data = await this.cache.with(
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
					events
				};
			}
		);

		let page = Number(url.searchParams.get('page'));
		if (!isFinite(page)) {
			page = 0;
		}

		const [events, prevPage, nextPage] = clamp(
			data.events.length,
			page,
			this.config.itemsPerPage,
			data.events
		);

		return {
			ts: data.ts,
			type: 'data',
			events
		};
	}
}

import { authenticate } from '@google-cloud/local-auth';
import { readFile, writeFile } from 'fs/promises';
import type { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import { resolve } from 'path';

import { Service } from './service';

const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
const TOKEN_PATH = 'data/calendar/token.json';
const CREDENTIALS_PATH = 'data/calendar/credentials.json';

export interface CalendarEvent {
	tsStart: string;
	tsEnd: string;
	content: string;
	isWholeDay: boolean;
}

export class Calendar extends Service {
	private creds: OAuth2Client | null = null;
	private timer: NodeJS.Timer | null = null;

	public events: CalendarEvent[] | null = null;

	protected override async doInit(): Promise<void> {
		this.creds = await this.authorize();
	}

	protected override async doStart(): Promise<void> {
		await this.update();

		if (process.env['CALENDAR_UPDATE_INTERVAL']) {
			const interval = 1000 * Number(process.env['CALENDAR_UPDATE_INTERVAL']);
			this.timer = setInterval(this.update, interval);
			this.log('UPDATE STARTED', interval);
		} else {
			this.log('UPDATE DISABLED');
		}
	}

	protected override async doStop(): Promise<void> {
		if (this.timer) {
			clearInterval(this.timer);
			this.timer = null;
		}

		this.events = null;
	}

	protected override async doDispose(): Promise<void> {}

	private update = async () => {
		if (!this.creds) {
			this.warn('No calendar credentials');
			return;
		}

		const calendar = google.calendar({ version: 'v3', auth: this.creds });
		const res = await calendar.events.list({
			calendarId: '3isnbvbudasaevou1g6ejr6ni0@group.calendar.google.com',
			timeMin: new Date().toISOString(),
			maxResults: 10,
			singleEvents: true,
			orderBy: 'startTime'
		});

		if (!res.data.items) {
			this.warn('No calendar events');
			return;
		}

		const events: CalendarEvent[] = [];
		for (const event of res.data.items) {
			const start = event.start?.dateTime || event.start?.date;
			const end = event.end?.dateTime || event.end?.date;
			if (!start || !end || !event.summary) {
				this.warn('Invalid calendar event', event);
				continue;
			}

			events?.push({ tsStart: start, tsEnd: end, content: event.summary, isWholeDay: !!event.start?.date });
		}
		this.events = events;
	};

	private async loadSavedCredentialsIfExist(): Promise<OAuth2Client | null> {
		try {
			const content = await readFile(TOKEN_PATH, 'utf-8');
			const credentials = JSON.parse(content);
			return google.auth.fromJSON(credentials) as any;
		} catch (err) {
			return null;
		}
	}

	private async saveCredentials(client: OAuth2Client): Promise<void> {
		const content = await readFile(CREDENTIALS_PATH, 'utf-8');
		const keys = JSON.parse(content);
		const key = keys.installed || keys.web;
		const payload = JSON.stringify({
			type: 'authorized_user',
			client_id: key.client_id,
			client_secret: key.client_secret,
			refresh_token: client.credentials.refresh_token
		});
		await writeFile(TOKEN_PATH, payload);
	}

	private async authorize() {
		let client = await this.loadSavedCredentialsIfExist();
		if (client) {
			return client;
		}
		client = await authenticate({
			scopes: SCOPES,
			keyfilePath: resolve(CREDENTIALS_PATH)
		});
		if (client.credentials) {
			await this.saveCredentials(client);
		}
		return client;
	}
}

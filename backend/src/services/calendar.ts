import { authenticate } from '@google-cloud/local-auth';
import { readFile, rm, writeFile } from 'fs/promises';
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
	private client: OAuth2Client | null = null;

	public events: CalendarEvent[] | null = null;

	protected override async doInit(): Promise<void> {
		this.client = await this.authorize();
	}

	protected override async doStart(): Promise<void> {
		this.events = null;
	}

	protected override async doUpdate(): Promise<void> {
		try {
			if (!this.client) {
				this.client = await this.authorize();
			} else {
				await this.client.refreshAccessToken();
			}

			const calendar = google.calendar({ version: 'v3', auth: this.client });
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
		} catch (err: any) {
			if (err.code === '400') {
				await rm(TOKEN_PATH);
				this.client = null;
			} else {
				throw err;
			}
		}
	}

	protected override async doStop(): Promise<void> {
		this.events = null;
	}

	protected override async doDispose(): Promise<void> {}

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

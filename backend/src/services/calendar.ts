import { Service } from './service';

export interface CalendarEvent {
	ts: string;
	repeats: string;
	description: string;
}

export class Calendar extends Service {
	public readonly enabled = process.env.CALENDAR_ENABLED === '1';

	public events: CalendarEvent[] = [];

	public override async init(): Promise<void> {
		if (!this.enabled) {
			this.log('CALENDAR DISABLED');
			return;
		}

		await this.app.storage.run(
			'CREATE TABLE IF NOT EXISTS events (id INTEGER PRIMARY KEY AUTOINCREMENT, ts DATETIME, repeat TEXT, description TEXT)'
		);
		this.events = await this.app.storage.all('SELECT * FROM events');
		this.log(`Loaded ${this.events.length} events`);
	}
}

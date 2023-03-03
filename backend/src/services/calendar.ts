import { Service } from './service';

export interface CalendarEvent {
	ts: string;
	repeats: string;
	description: string;
}

export class Calendar extends Service {
	public updatedAt: Date | null = null;
	public events: CalendarEvent[] | null = null;

	protected override async doInit(): Promise<void> {
		await this.app.storage.run(
			'CREATE TABLE IF NOT EXISTS events (id INTEGER PRIMARY KEY AUTOINCREMENT, ts DATETIME, repeat TEXT, description TEXT)'
		);
	}

	protected override async doStart(): Promise<void> {
		this.events = await this.app.storage.all('SELECT * FROM events');
		this.log(`Loaded ${this.events.length} events`);
	}

	protected override async doStop(): Promise<void> {
		this.updatedAt = null;
		this.events = null;
	}

	protected override async doDispose(): Promise<void> {}
}

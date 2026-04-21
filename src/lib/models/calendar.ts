import type { ServiceConfig } from './service';

// ---------
// Service
// ---------

export const CALENDAR_SERVICE_TYPE = 'calendar';
export const CALENDAR_SERVICE_ACTIONS = ['main', 'config'] as const;

export type CalendarServiceAction = (typeof CALENDAR_SERVICE_ACTIONS)[number];

export interface CalendarServiceConfig extends ServiceConfig {
	calendarId: string;
	privateKey: string;
	serviceEmail: string;
	itemsPerPage: number;
}

// ---------
// Others
// ---------

export interface CalendarEvent {
	tsStart: Date;
	tsEnd: Date;
	content: string;
	isWholeDay: boolean;
}

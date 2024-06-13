import type { ServiceConfig, ServiceData } from './service';

// ---------
// Service
// ---------

export const CALENDAR_SERVICE_TYPE = 'calendar';
export const CALENDAR_SERVICE_ACTIONS = ['main', 'preview', 'config'] as const;

export type CalendarServiceAction = (typeof CALENDAR_SERVICE_ACTIONS)[number];

export interface CalendarServiceMainData extends ServiceData {
	type: 'data';
	events: CalendarEvent[];
}
export interface CalendarServiceConfigData extends ServiceData {
	type: 'config';
	config: CalendarServiceConfig;
}
export type CalendarServiceData = CalendarServiceMainData | CalendarServiceConfigData;

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

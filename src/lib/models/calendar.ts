import type { ServiceConfig, ServiceData, ServiceInstance } from './service';
import type { WidgetConfig, WidgetData } from './widget';

// ---------
// Widgets
// ---------

export const CALENDAR_WIDGET_TYPE = 'calendar';
export const CALENDAR_WIDGET_ACTIONS = ['', 'config'] as const;

export type CalendarWidgetAction = (typeof CALENDAR_WIDGET_ACTIONS)[number];

export interface CalendarWidgetMainData extends WidgetData<CalendarWidgetAction> {
	action: '';
	events: CalendarEvent[];
	prevPage: number;
	nextPage: number;
}
export interface CalendarWidgetConfigData extends WidgetData<CalendarWidgetAction> {
	action: 'config';
	config: CalendarWidgetConfig;
	services: ServiceInstance[];
}
export type CalendarWidgetData = CalendarWidgetMainData | CalendarWidgetConfigData;

export interface CalendarWidgetConfig extends WidgetConfig {
	service: string;
	itemsPerPage: number;
}

// ---------
// Service
// ---------

export const CALENDAR_SERVICE_TYPE = 'calendar';
export const CALENDAR_SERVICE_ACTIONS = ['', 'config'] as const;

export type CalendarServiceAction = (typeof CALENDAR_SERVICE_ACTIONS)[number];

export interface CalendarServiceMainData extends ServiceData<CalendarWidgetAction> {
	action: '';
	events: CalendarEvent[];
}
export interface CalendarServiceConfigData extends ServiceData<CalendarWidgetAction> {
	action: 'config';
	config: CalendarServiceConfig;
}
export type CalendarServiceData = CalendarServiceMainData | CalendarServiceConfigData;

export interface CalendarServiceConfig extends ServiceConfig {
	calendarId: string;
	privateKey: string;
	serviceEmail: string;
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

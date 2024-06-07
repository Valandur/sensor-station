import type { ServiceConfig, ServiceData, ServiceInstance } from './service';
import type { WidgetConfig, WidgetInstance, WidgetProps } from './widget';

// ---------
// Widgets
// ---------

export const CALENDAR_WIDGET_TYPE = 'calendar';

export type CalendarWidgetInstance = WidgetInstance<CalendarWidgetConfig>;

export interface CalendarWidgetConfig extends WidgetConfig {
	serviceName: string;
}

export interface CalendarWidgetProps extends WidgetProps {
	events: CalendarEvent[];
}

// ---------
// Service
// ---------

export const CALENDAR_SERVICE_TYPE = 'calendar';

export type CalendarServiceInstance = ServiceInstance<CalendarServiceConfig>;

export interface CalendarServiceData extends ServiceData {
	events: CalendarEvent[];
}

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

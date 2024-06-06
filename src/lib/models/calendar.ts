import type { ServiceConfig, ServiceData } from './service';
import type { WidgetConfig, WidgetProps } from './widget';

// ---------
// Widgets
// ---------

export const CALENDAR_WIDGET_TYPE = 'calendar';

export interface CalendarWidgetConfig extends WidgetConfig {
	serviceName: string;
}

export interface CalendarWidgetProps extends WidgetProps {
	events: CalendarEvent[];
}

// ---------
// Service
// ---------

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

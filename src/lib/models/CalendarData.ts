import type { BaseData } from './BaseData';
import type { CalendarEvent } from './CalendarEvent';

export interface CalendarData extends BaseData {
	events: CalendarEvent[];
}

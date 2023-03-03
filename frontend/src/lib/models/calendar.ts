import { gql } from '@urql/svelte';

export interface Calendar {
	events: CalendarEvent[];
}

export interface CalendarEvent {
	ts: string;
	repeats: string;
	content: string;
}

export interface GetCalendarData {
	calendar: Calendar;
}
export const GET_CALENDAR = gql`
	query GetCalendar {
		calendar {
			events {
				ts
				repeats
				content
			}
		}
	}
`;

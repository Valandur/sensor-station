import { gql } from '@urql/svelte';

export interface Calendar {
	events: CalendarEvent[];
}

export interface CalendarEvent {
	tsStart: string;
	tsEnd: string;
	content: string;
	isWholeDay: boolean;
}

export interface GetCalendarData {
	calendar: Calendar;
}
export const GET_CALENDAR = gql`
	query GetCalendar {
		calendar {
			events {
				tsStart
				tsEnd
				content
				isWholeDay
			}
		}
	}
`;

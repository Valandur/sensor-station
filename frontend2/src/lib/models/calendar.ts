import { gql } from '@urql/svelte';

export interface CalendarEvent {
	ts: string;
	repeats: string;
	description: string;
}

export interface GetCalendarData {
	events: CalendarEvent[];
}
export const GET_CALENDAR = gql`
	query GetCalendar {
		events {
			ts
			repeats
			description
		}
	}
`;

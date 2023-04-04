import { gql } from '@urql/svelte';

export interface CalendarEvent {
	tsStart: string;
	tsEnd: string;
	content: string;
	isWholeDay: boolean;
}

export interface CalendarEvents {
	calendar: {
		events: CalendarEvent[] | null;
	};
}
export const CALENDAR_EVENTS = gql`
	fragment CalendarEvents on Query {
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

import { gql } from '@urql/svelte';

export interface Screen {
	name: string;
	params: string;
}

export type GetScreensData = {
	screens: Screen[];
};

export const GET_SCREENS = gql`
	query GetScreens {
		screens {
			name
			params
		}
	}
`;

export const SAVE_SCREENS = gql`
	mutation SaveScreens($screens: [ScreenInput!]!) {
		saveScreens(screens: $screens) {
			name
			params
		}
	}
`;

export const screenNames: { [key: string]: string } = {
	uploads: 'Bilder',
	calendar: 'Kalender',
	news: 'News',
	sbb: 'SBB',
	games: 'Spiele',
	weather: 'Wetter'
};

export const screenParams: { [key: string]: { [key: string]: string } } = {
	news: {
		'1646': 'Allgemein',
		'718': 'Sport',
		'454': 'Kultur',
		'630': 'Wissen'
	},
	weather: {
		daily: 'Täglich',
		hourly: 'Stündlich'
	}
};

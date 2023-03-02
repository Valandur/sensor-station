import { gql } from '@urql/svelte';

export interface Screen {
	id: number;
	name: string;
	params: string;
}

export type GetScreensData = {
	screens: Screen[];
};

export const GET_SCREENS = gql`
	query GetScreens {
		screens {
			id
			name
			params
		}
	}
`;

export const SAVE_SCREENS = gql`
	mutation SaveScreens($screens: [ScreenInput!]!) {
		saveScreens(screens: $screens) {
			id
			name
			params
		}
	}
`;

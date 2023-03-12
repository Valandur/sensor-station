import { gql } from '@urql/svelte';

export interface Games {
	freeEpic: Game[];
}

export interface Game {
	title: string;
	startsAt: string;
	endsAt: string;
	image: string | null;
}

export interface GetGames {
	games: Games;
}
export const GET_GAMES = gql`
	query GetGames {
		games {
			freeEpic {
				title
				startsAt
				endsAt
				image
			}
		}
	}
`;

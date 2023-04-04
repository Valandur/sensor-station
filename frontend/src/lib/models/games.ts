import { gql } from '@urql/svelte';

export interface Game {
	title: string;
	startsAt: string;
	endsAt: string;
	image: string | null;
}

export interface GamesFree {
	games: {
		freeEpic: Game[] | null;
	};
}
export const GAMES_FREE = gql`
	fragment GamesFree on Query {
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

import { gql } from '@urql/svelte';

export const RESTART = gql`
	mutation Restart {
		restart
	}
`;

import { gql } from '@urql/svelte';

export interface SBB {
	alerts: SBBAlert[];
}

export interface SBBAlert {
	start: Date;
	end: Date;
	planned: boolean;
	summary: string;
	reason: string;
	description: string;
	consequence: string;
	duration: string;
	recommendation: string;
}

export interface GetSBB {
	sbb: SBB;
}
export const GET_SBB = gql`
	query GetSBB {
		sbb {
			alerts {
				start
				end
				planned
				summary
				reason
				description
				consequence
				duration
				recommendation
			}
		}
	}
`;

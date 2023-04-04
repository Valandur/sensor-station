import { gql } from '@urql/svelte';

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

export interface SBBAlerts {
	sbb: {
		alerts: SBBAlert[] | null;
	};
}
export const SBB_ALERTS = gql`
	fragment SBBAlerts on Query {
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

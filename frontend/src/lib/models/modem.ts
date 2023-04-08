import { gql } from '@urql/svelte';

export interface Status {
	isConnected: boolean;
	time: string;
	tzOffset: string;
	operator: string;
	signal: number;
	lat: number;
	lng: number;
	tzName: string;
	cached: boolean;
}

export interface ModemStatus {
	modem: {
		updatedAt: string | null;
		status: Status | null;
	};
}
export const MODEM_STATUS = gql`
	fragment ModemStatus on Query {
		modem {
			updatedAt
			status {
				isConnected
				time
				tzOffset
				operator
				signal
				lat
				lng
				tzName
				cached
			}
		}
	}
`;

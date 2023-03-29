import { gql } from '@urql/svelte';

export interface Modem {
	status: ModemStatus | null;
}

export interface ModemStatus {
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

export interface GetModemData {
	modem: Modem;
}
export const GET_MODEM = gql`
	query GetModem {
		modem {
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

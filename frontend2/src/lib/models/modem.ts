import { gql } from '@urql/svelte';

export interface ModemStatusInfo {
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
	modem: ModemStatusInfo;
}
export const GET_MODEM = gql`
	query GetModem {
		modem {
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
`;

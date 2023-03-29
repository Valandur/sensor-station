import { gql } from '@urql/svelte';

export interface Battery {
	status: BatteryStatus | null;
}

export interface BatteryStatus {
	isFault: boolean;
	isButton: boolean;
	status: string;
	powerIn: string;
	powerIn5vIo: string;
	charge: number;
	voltage: number;
	current: number;
}

export interface GetBatteryData {
	battery: Battery;
}
export const GET_BATTERY = gql`
	query GetBattery {
		battery {
			status {
				isFault
				isButton
				status
				powerIn
				powerIn5vIo
				charge
				voltage
				current
			}
		}
	}
`;

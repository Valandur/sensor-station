import { gql } from '@urql/svelte';

export interface BatteryStatusInfo {
	isFault: boolean;
	isButton: boolean;
	batteryStatus: string;
	powerIn: string;
	powerIn5vIo: string;
	charge: number;
	voltage: number;
	current: number;
}

export interface GetBatteryData {
	battery: BatteryStatusInfo;
}
export const GET_BATTERY = gql`
	query GetBattery {
		battery {
			isFaul
			isButton
			batteryStatus
			powerIn
			powerIn5vIo
			charge
			voltage
			current
		}
	}
`;

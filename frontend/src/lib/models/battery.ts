import { gql } from '@urql/svelte';

export interface Battery {
	status: BatteryStatus | null;
}

export interface BatteryStatus {
	isFault: boolean;
	isButton: boolean;
	status: string;
	charge: number;
	temperature: number;
	powerIn: {
		state: string;
		voltage: number;
		current: number;
	};
	powerIn5vIo: {
		state: string;
		voltage: number;
		current: number;
	};
	fault: {
		buttonPowerOff: boolean;
		forcedPowerOff: boolean;
		forcedSysPowerOff: boolean;
		watchdogReset: boolean;
		batteryProfileInvalid: boolean;
		chargingTemperatureFault: string;
	};
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
				charge
				temperature
				powerIn {
					state
					voltage
					current
				}
				powerIn5vIo {
					state
					voltage
					current
				}
				fault {
					buttonPowerOff
					forcedPowerOff
					forcedSysPowerOff
					watchdogReset
					batteryProfileInvalid
					chargingTemperatureFault
				}
			}
		}
	}
`;

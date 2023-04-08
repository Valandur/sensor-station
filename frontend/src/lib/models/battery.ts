import { gql } from '@urql/svelte';

export interface Status {
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

export interface BatteryStatus {
	battery: {
		updatedAt: string | null;
		status: Status | null;
	};
}
export const BATTERY_STATUS = gql`
	fragment BatteryStatus on Query {
		battery {
			updatedAt
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

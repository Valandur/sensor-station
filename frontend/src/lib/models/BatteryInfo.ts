export enum BatteryState {
	NORMAL = 0,
	CHARGING_FROM_IN = 1,
	CHARGING_FROM_5V_IO = 2,
	NONE = 3
}

export enum BatteryPowerState {
	NONE = 0,
	BAD = 1,
	WEAK = 2,
	PRESENT = 3
}

export enum BatteryChargingTemperature {
	NORMAL = 0,
	SUSPEND = 1,
	COOL = 2,
	WARM = 3
}

export interface BatteryInfo {
	ts: Date;
	isFault: boolean;
	isButton: boolean;
	state: string;
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

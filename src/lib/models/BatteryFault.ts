export interface BatteryFault {
	buttonPowerOff: boolean;
	forcedPowerOff: boolean;
	forcedSysPowerOff: boolean;
	watchdogReset: boolean;
	batteryProfileInvalid: boolean;
	chargingTemperatureFault: string;
}

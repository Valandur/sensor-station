import type { ServiceConfig, ServiceData } from './service';

// ---------
// Service
// ---------

export const BATTERY_SERVICE_TYPE = 'battery';
export const BATTERY_SERVICE_ACTIONS = ['config', 'icon'] as const;

export type BatteryServiceAction = (typeof BATTERY_SERVICE_ACTIONS)[number];

export interface BatteryServiceMainData extends ServiceData {
	type: 'data';
	info: BatteryInfo;
}
export interface BatteryServiceConfigData extends ServiceData {
	type: 'config';
	config: BatteryServiceConfig;
}
export type BatteryServiceData = BatteryServiceMainData | BatteryServiceConfigData;

export interface BatteryServiceConfig extends ServiceConfig {
	busNumber: number;
	i2cAddress: number;
}

// ---------
// Others
// ---------

export interface BatteryInfo {
	isFault: boolean;
	isButton: boolean;
	state: string;
	charge: number;
	temperature: number;
	powerIn: BatteryPower;
	powerIn5vIo: BatteryPower;
	fault: BatteryFault;
}

export enum BatteryChargingTemperature {
	NORMAL = 0,
	SUSPEND = 1,
	COOL = 2,
	WARM = 3
}

export interface BatteryFault {
	buttonPowerOff: boolean;
	forcedPowerOff: boolean;
	forcedSysPowerOff: boolean;
	watchdogReset: boolean;
	batteryProfileInvalid: boolean;
	chargingTemperatureFault: string;
}

export interface BatteryPower {
	state: string;
	voltage: number;
	current: number;
}

export enum BatteryPowerState {
	NONE = 0,
	BAD = 1,
	WEAK = 2,
	PRESENT = 3
}

export enum BatteryState {
	NORMAL = 0,
	CHARGING_FROM_IN = 1,
	CHARGING_FROM_5V_IO = 2,
	NONE = 3
}

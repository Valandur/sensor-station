import type { ServiceConfig, ServiceData } from './service';

// ---------
// Service
// ---------

export const DHT_SENSOR_SERVICE_TYPE = 'dht-sensor';
export const DHT_SENSOR_SERVICE_ACTIONS = ['main', 'preview', 'config'] as const;

export type DhtSensorServiceAction = (typeof DHT_SENSOR_SERVICE_ACTIONS)[number];

export interface DhtSensorServiceMainData extends ServiceData {
	type: 'data';
	measurement: Measurement;
}
export interface DhtSensorServiceConfigData extends ServiceData {
	type: 'config';
	config: DhtSensorServiceConfig;
}
export type DhtSensorServiceData = DhtSensorServiceMainData | DhtSensorServiceConfigData;

export interface DhtSensorServiceConfig extends ServiceConfig {
	devicePath: string;
	dhtType: number;
	dhtPin: number;
}

// ---------
// Others
// ---------

export interface Measurement {
	ts: Date;
	temp: number;
	rh: number;
}

export interface DhtSensor {
	read(type: number, pin: number): Promise<{ temperature: number; humidity: number }>;
}

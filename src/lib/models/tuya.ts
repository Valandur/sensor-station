import type { ServiceConfig, ServiceData, ServiceInstance } from './service';
import type { WidgetConfig, WidgetInstance, WidgetData } from './widget';

// ---------
// Widgets
// ---------

export const TUYA_WIDGET_TYPE = 'tuya';

export type TuyaWidgetInstance = WidgetInstance<TuyaWidgetConfig>;

export interface TuyaWidgetConfig extends WidgetConfig {
	serviceName: string;
}

export interface TuyaWidgetProps extends WidgetData {
	info: TuyaInfo;
}

// ---------
// Service
// ---------

export const TUYA_SERVICE_TYPE = 'tuya';

export type TuyaServiceInstance = ServiceInstance<TuyaServiceConfig>;

export interface TuyaServiceConfig extends ServiceConfig {
	clientId: string;
	clientSecret: string;
	protocolVersion: string;
	deviceIp: string;
}

export interface TuyaServiceData extends ServiceData {
	info: TuyaInfo;
}

// ---------
// Others
// ---------

export interface TuyaInfo {
	on: boolean;
	waterTime: number;
	filterLife: number;
	pumpTime: number;
	waterReset: boolean;
	filterReset: boolean;
	pumpReset: boolean;
	uv: boolean;
	uvRuntime: number;
	waterLevel: number;
	waterLack: boolean;
	ecoMode: number;
	waterState: boolean;
	waterEmpty: boolean;
}

const FILTER_LIFE_MAX = 43200;
const PUMP_TIME_MAX = 86400;
const UV_RUNTIME_MAX = 10800;
const IDENT = (value: unknown) => value;

interface TuyaProp {
	key: keyof Omit<TuyaInfo, 'ts'>;
	map: (value: any) => unknown;
}

export const PROP_MAP: Map<number, TuyaProp> = new Map([
	[1, { key: 'on', map: IDENT }],
	[3, { key: 'waterTime', map: IDENT }],
	[4, { key: 'filterLife', map: (value: number) => (value / FILTER_LIFE_MAX) * 100 }],
	[5, { key: 'pumpTime', map: (value: number) => (value / PUMP_TIME_MAX) * 100 }],
	[6, { key: 'waterReset', map: IDENT }],
	[7, { key: 'filterReset', map: IDENT }],
	[8, { key: 'pumpReset', map: IDENT }],
	[10, { key: 'uv', map: IDENT }],
	[11, { key: 'uvRuntime', map: (value: number) => (value / UV_RUNTIME_MAX) * 100 }],
	[
		12,
		{
			key: 'waterLevel',
			map: (value: string) => (value === 'level_3' ? 100 : value === 'level_2' ? 50 : 0)
		}
	],
	[101, { key: 'waterLack', map: IDENT }],
	[102, { key: 'ecoMode', map: IDENT }],
	[103, { key: 'waterState', map: IDENT }],
	[104, { key: 'waterEmpty', map: IDENT }]
]);

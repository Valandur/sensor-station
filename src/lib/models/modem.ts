import type { ServiceConfig, ServiceData } from './service';

// ---------
// Service
// ---------

export const MODEM_SERVICE_TYPE = 'modem';
export const MODEM_SERVICE_ACTIONS = ['main', 'icon', 'config'] as const;

export type ModemServiceAction = (typeof MODEM_SERVICE_ACTIONS)[number];

export interface ModemServiceMainData extends ServiceData {
	type: 'data';
	info: ModemInfo;
}
export interface ModemServiceConfigData extends ServiceData {
	type: 'config';
	config: ModemServiceConfig;
}
export type ModemServiceData = ModemServiceMainData | ModemServiceConfigData;

export interface ModemServiceConfig extends ServiceConfig {
	devicePath: string;
	baudRate: number;
	pauseTime: number;
	waitTime: number;
	cmdTimeout: number;
	googleApiKey: string;
	unwiredToken: string;
}

// ---------
// Others
// ---------

export interface ModemInfo {
	cellular: {
		operator: string | null;
		signal: number | null;
		netType: string | null;
		mcc: number | null;
		mnc: number | null;
		lac: number | null;
		cid: number | null;
		time: Date | null;
		tz: string | null;
	};
	gps: ModemLocation | null;
	geo: ModemLocation | null;
}

export interface ModemLocation {
	lat: number;
	lng: number;
	tz: string | null;
}

export enum ModemNetworkType {
	'NONE' = 0,
	'GSM' = 1,
	'GPRS' = 2,
	'EDGE' = 3,
	'WCDMA' = 4,
	'WCDMA_HSDPA' = 5,
	'WCDMA_HSUPA' = 6,
	'HSPA' = 7,
	'LTE' = 8,
	'TDS_CDMA' = 9,
	'TDS_HSDPA' = 10,
	'TDS_HSUPA' = 11,
	'TDS_HSPA' = 12,
	'CDMA' = 13,
	'EVDO' = 14,
	'HYBRID' = 15,
	'CDMA_LTE' = 16,
	'eHRPD' = 23,
	'CDMA_eHRPD' = 24
}

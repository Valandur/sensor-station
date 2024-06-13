import type { HolidaysTypes } from 'date-holidays';

import type { ServiceConfig, ServiceData } from './service';

// ---------
// Service
// ---------

export const HOLIDAY_SERVICE_TYPE = 'holiday';
export const HOLIDAY_SERVICE_ACTIONS = ['main', 'preview', 'config'] as const;

export type HolidayServiceAction = (typeof HOLIDAY_SERVICE_ACTIONS)[number];

export interface HolidayServiceMainData extends ServiceData {
	type: 'data';
	holiday: HolidaysTypes.Holiday | null;
}
export interface HolidayServiceConfigData extends ServiceData {
	type: 'config';
	config: HolidayServiceConfig;
}
export type HolidayServiceData = HolidayServiceMainData | HolidayServiceConfigData;

export interface HolidayServiceConfig extends ServiceConfig {
	country: string;
	state: string;
}

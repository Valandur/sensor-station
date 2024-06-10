import type { HolidaysTypes } from 'date-holidays';

import type { ServiceConfig, ServiceData, ServiceInstance } from './service';

// ---------
// Service
// ---------

export const HOLIDAY_SERVICE_TYPE = 'holiday';

export type HolidayServiceInstance = ServiceInstance<HolidayServiceConfig>;

export interface HolidayServiceData extends ServiceData {
	holiday: HolidaysTypes.Holiday | null;
}

export interface HolidayServiceConfig extends ServiceConfig {
	country: string;
	state: string;
}

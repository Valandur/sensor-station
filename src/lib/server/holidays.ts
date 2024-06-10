import Holidays, { type HolidaysTypes } from 'date-holidays';

import {
	HOLIDAY_SERVICE_TYPE,
	type HolidayServiceConfig,
	type HolidayServiceData,
	type HolidayServiceInstance
} from '$lib/models/holiday';

import { BaseService } from './BaseService';

let holiday: HolidaysTypes.Holiday | null = null;

class HolidayService extends BaseService<HolidayServiceConfig, HolidayServiceData> {
	public override readonly type = HOLIDAY_SERVICE_TYPE;

	public constructor() {
		super('HOLIDAY');
	}

	public get(
		{ name, config }: HolidayServiceInstance,
		forceUpdate?: boolean | undefined
	): Promise<HolidayServiceData> {
		return this.cache.with(
			{
				key: `${config.country}-${config.state}`,
				force: forceUpdate,
				resultCacheTime: config.resultCacheTime,
				errorCacheTime: config.errorCacheTime
			},
			async () => {
				const holidays = new Holidays(config.country, config.state);
				const holi = holidays.isHoliday(new Date());
				holiday = holi ? holi[0] : null;
				return {
					ts: new Date(),
					name,
					holiday
				};
			}
		);
	}

	public validate(
		instance: HolidayServiceInstance,
		config: FormData
	): Promise<HolidayServiceConfig> {
		throw new Error('Method not implemented.');
	}
}

export default new HolidayService();

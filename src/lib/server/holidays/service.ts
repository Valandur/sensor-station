import Holidays, { type HolidaysTypes } from 'date-holidays';
import { error, fail } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

import type { ServiceActionFailure } from '$lib/models/service';
import {
	HOLIDAY_SERVICE_TYPE,
	HOLIDAY_SERVICE_ACTIONS,
	type HolidayServiceAction,
	type HolidayServiceConfig,
	type HolidayServiceMainData,
	type HolidayServiceConfigData
} from '$lib/models/holiday';

import { Cache } from '../Cache';
import {
	BaseService,
	type ServiceActions,
	type ServiceGetDataOptions,
	type ServiceSetDataOptions
} from '../BaseService';

interface CacheData {
	ts: Date;
	holiday: HolidaysTypes.Holiday | null;
}

const ENABLED = env.HOLIDAY_ENABLED === '1';

export class HolidayService extends BaseService<HolidayServiceAction, HolidayServiceConfig> {
	public static readonly actions = HOLIDAY_SERVICE_ACTIONS;
	public override readonly type = HOLIDAY_SERVICE_TYPE;

	private readonly cache: Cache<CacheData> = new Cache(this.logger);

	protected getDefaultConfig(): HolidayServiceConfig {
		return {
			country: '',
			state: ''
		};
	}

	protected getActions(): ServiceActions<HolidayServiceAction> {
		return {
			config: {
				get: this.getConfig.bind(this),
				set: this.setConfig.bind(this)
			},
			main: {
				get: this.getData.bind(this)
			},
			preview: {
				get: this.getData.bind(this)
			}
		};
	}

	public async getConfig(_: ServiceGetDataOptions): Promise<HolidayServiceConfigData> {
		if (!ENABLED) {
			error(400, {
				message: `Holiday service is disabled`,
				key: 'holiday.disabled'
			});
		}

		return {
			ts: new Date(),
			type: 'config',
			config: this.config
		};
	}

	public async setConfig({ form }: ServiceSetDataOptions): Promise<void | ServiceActionFailure> {
		const country = form.get('country');
		if (typeof country !== 'string') {
			return fail(400, { key: 'holiday.country.invalid', message: 'Invalid country' });
		}

		const state = form.get('state');
		if (typeof state !== 'string') {
			return fail(400, { key: 'holiday.state.invalid', message: 'Invalid state' });
		}

		this.config.country = country;
		this.config.state = state;
	}

	public async getData({ url }: ServiceGetDataOptions): Promise<HolidayServiceMainData> {
		if (!ENABLED) {
			error(400, {
				message: `Holiday service is disabled`,
				key: 'holiday.disabled'
			});
		}

		const forceUpdate = url.searchParams.has('force');

		const data = await this.cache.with(
			{
				key: `${this.config.country}-${this.config.state}`,
				force: forceUpdate,
				resultCacheTime: this.config.resultCacheTime,
				errorCacheTime: this.config.errorCacheTime
			},
			async () => {
				const holidays = new Holidays(this.config.country, this.config.state);
				const holi = holidays.isHoliday(new Date());
				const holiday = holi ? holi[0] : null;

				return {
					ts: new Date(),
					holiday
				};
			}
		);

		return {
			ts: data.ts,
			type: 'data',
			holiday: data.holiday
		};
	}
}

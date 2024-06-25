import { env } from '$env/dynamic/private';
import { error, fail } from '@sveltejs/kit';

import type { ServiceActionFailure } from '$lib/models/service';
import {
	BATTERY_SERVICE_TYPE,
	BATTERY_SERVICE_ACTIONS,
	type BatteryInfo,
	type BatteryServiceAction,
	type BatteryServiceConfig,
	type BatteryServiceConfigData,
	type BatteryServiceMainData
} from '$lib/models/battery';

import { Cache } from '../Cache';
import {
	BaseService,
	type ServiceActions,
	type ServiceGetDataOptions,
	type ServiceSetDataOptions
} from '../BaseService';
import { Device } from './Device';

interface CacheData {
	ts: Date;
	info: BatteryInfo;
}

const ENABLED = env.BATTERY_ENABLED === '1';

export class BatteryService extends BaseService<BatteryServiceAction, BatteryServiceConfig> {
	public static readonly actions = BATTERY_SERVICE_ACTIONS;
	public override readonly type = BATTERY_SERVICE_TYPE;

	private readonly cache: Cache<CacheData> = new Cache(this.logger);

	protected getDefaultConfig(): BatteryServiceConfig {
		return {
			busNumber: 0x01,
			i2cAddress: 0x14
		};
	}

	protected getActions(): ServiceActions<BatteryServiceAction> {
		return {
			config: {
				get: this.getConfig.bind(this),
				set: this.setConfig.bind(this)
			},
			preview: {
				get: this.getData.bind(this)
			},
			icon: {
				get: this.getData.bind(this)
			}
		};
	}

	public async getConfig(_: ServiceGetDataOptions): Promise<BatteryServiceConfigData> {
		if (!ENABLED) {
			error(400, `Battery is disabled`);
		}

		return {
			ts: new Date(),
			type: 'config',
			config: this.config
		};
	}

	public async setConfig({ form }: ServiceSetDataOptions): Promise<void | ServiceActionFailure> {
		const busNumber = Number(form.get('busNumber'));
		if (!isFinite(busNumber)) {
			return fail(400, { message: 'Invalid bus number' });
		}

		const i2cAddress = Number(form.get('i2cAddress'));
		if (!isFinite(i2cAddress)) {
			return fail(400, { message: 'Invalid i2c address' });
		}

		this.config.busNumber = busNumber;
		this.config.i2cAddress = i2cAddress;
	}

	public async getData({ url }: ServiceGetDataOptions): Promise<BatteryServiceMainData> {
		if (!ENABLED) {
			error(400, `Battery is disabled`);
		}

		const forceUpdate = url.searchParams.has('force');

		let device: Device | null = null;

		const data = await this.cache.with(
			{
				key: `${this.config.busNumber}-${this.config.i2cAddress}`,
				force: forceUpdate,
				resultCacheTime: this.config.resultCacheTime,
				errorCacheTime: this.config.errorCacheTime
			},
			async () => {
				device = new Device(this.config.busNumber, this.config.i2cAddress);

				if (!(await device.checkReady())) {
					error(500, `Battery not ready`);
				}

				await device.open();

				const info = await device.readAll();

				return {
					ts: new Date(),
					info
				};
			},
			async () => {
				await device?.close();
			}
		);

		return {
			ts: data.ts,
			type: 'data',
			info: data.info
		};
	}
}

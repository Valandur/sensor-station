import { error, fail } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { stat } from 'fs/promises';

import type { ServiceActionFailure } from '$lib/models/service';
import {
	DHT_SENSOR_SERVICE_TYPE,
	DHT_SENSOR_SERVICE_ACTIONS,
	type DhtSensor,
	type DhtSensorServiceAction,
	type DhtSensorServiceConfig,
	type DhtSensorServiceConfigData,
	type DhtSensorServiceMainData,
	type Measurement
} from '$lib/models/dht-sensor';

import {
	BaseService,
	type ServiceActions,
	type ServiceGetDataOptions,
	type ServiceSetDataOptions
} from '../BaseService';
import { Cache } from '../Cache';

type CacheData = Measurement;

const ENABLED = env.DHT_SENSOR_ENABLED === '1';

export class DhtSensorService extends BaseService<DhtSensorServiceAction, DhtSensorServiceConfig> {
	public static readonly actions = DHT_SENSOR_SERVICE_ACTIONS;
	public override readonly type = DHT_SENSOR_SERVICE_TYPE;

	private readonly cache = new Cache<CacheData>(this.logger);

	protected getDefaultConfig(): DhtSensorServiceConfig {
		return {
			devicePath: '/dev/gpiomem',
			dhtPin: 22,
			dhtType: 17
		};
	}

	protected getActions(): ServiceActions<DhtSensorServiceAction> {
		return {
			config: {
				get: this.getConfig.bind(this),
				set: this.setConfig.bind(this)
			},
			main: {
				get: this.getData.bind(this)
			}
		};
	}

	public async getConfig(_: ServiceGetDataOptions): Promise<DhtSensorServiceConfigData> {
		if (!ENABLED) {
			error(400, `DHT sensor is disabled`);
		}

		return {
			ts: new Date(),
			type: 'config',
			config: this.config
		};
	}

	public async setConfig({ form }: ServiceSetDataOptions): Promise<void | ServiceActionFailure> {
		const devicePath = form.get('devicePath');
		if (typeof devicePath !== 'string') {
			return fail(400, { message: 'Invalid device path' });
		}

		const dhtPin = Number(form.get('dhtPin'));
		if (!isFinite(dhtPin)) {
			return fail(400, { message: 'Invalid DHT pin' });
		}

		const dhtType = Number(form.get('dhtType'));
		if (!isFinite(dhtType)) {
			return fail(400, { message: 'Invalid DHT type' });
		}

		this.config.devicePath = devicePath;
		this.config.dhtPin = dhtPin;
		this.config.dhtType = dhtType;
	}

	public async getData({ url }: ServiceGetDataOptions): Promise<DhtSensorServiceMainData> {
		if (!ENABLED) {
			error(400, `DHT sensor is disabled`);
		}

		const forceUpdate = url.searchParams.has('force');

		const data = await this.cache.with(
			{
				key: `${this.config.dhtPin}-${this.config.dhtType}`,
				force: forceUpdate,
				resultCacheTime: this.config.resultCacheTime,
				errorCacheTime: this.config.errorCacheTime
			},
			async () => {
				if (!(await stat(this.config.devicePath).catch(() => null))) {
					error(500, `Sensor not ready`);
				}

				const str = 'node-dht';
				const dht = await import(/* @vite-ignore */ `${str}-sensor`);
				const sensor: DhtSensor = dht.promises;

				const { temperature, humidity } = await sensor.read(
					this.config.dhtType,
					this.config.dhtPin
				);

				return {
					ts: new Date(),
					temp: temperature,
					rh: humidity
				};
			}
		);

		return {
			ts: data.ts,
			type: 'data',
			measurement: data
		};
	}
}

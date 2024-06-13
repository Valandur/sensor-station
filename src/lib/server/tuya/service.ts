import TuyAPI, { type DPSObject } from 'tuyapi';
import { error, fail } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

import type { ServiceActionFailure } from '$lib/models/service';
import {
	PROP_MAP,
	TUYA_SERVICE_ACTIONS,
	TUYA_SERVICE_TYPE,
	type TuyaInfo,
	type TuyaServiceAction,
	type TuyaServiceConfig,
	type TuyaServiceConfigData,
	type TuyaServiceMainData
} from '$lib/models/tuya';

import { Cache } from '../Cache';
import {
	BaseService,
	type ServiceActions,
	type ServiceGetDataOptions,
	type ServiceSetDataOptions
} from '../BaseService';

interface CacheData {
	ts: Date;
	info: TuyaInfo;
}

const ENABLED = env.TUYA_ENABLED === '1';

export class TuyaService extends BaseService<TuyaServiceAction, TuyaServiceConfig> {
	public static readonly actions = TUYA_SERVICE_ACTIONS;
	public override readonly type = TUYA_SERVICE_TYPE;

	private readonly cache: Cache<CacheData> = new Cache(this.logger);

	protected getDefaultConfig(): TuyaServiceConfig {
		return {
			clientId: '',
			clientSecret: '',
			deviceIp: '',
			protocolVersion: '3.3'
		};
	}

	protected getActions(): ServiceActions<TuyaServiceAction> {
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

	public async getConfig(_: ServiceGetDataOptions): Promise<TuyaServiceConfigData> {
		if (!ENABLED) {
			error(400, {
				message: `TUYA is disabled`,
				key: 'tuya.disabled'
			});
		}

		return {
			ts: new Date(),
			type: 'config',
			config: this.config
		};
	}

	public async setConfig({ form }: ServiceSetDataOptions): Promise<void | ServiceActionFailure> {
		const clientId = form.get('clientId');
		if (typeof clientId !== 'string') {
			return fail(400, { key: 'tuya.clientId.invalid', message: 'Invalid client id' });
		}

		const clientSecret = form.get('clientSecret');
		if (typeof clientSecret !== 'string') {
			return fail(400, { key: 'tuya.clientSecret.invalid', message: 'Invalid client secret' });
		}

		const deviceIp = form.get('deviceIp');
		if (typeof deviceIp !== 'string') {
			return fail(400, { key: 'tuya.deviceIp.invalid', message: 'Invalid device IP' });
		}

		const protocolVersion = form.get('protocolVersion');
		if (typeof protocolVersion !== 'string') {
			return fail(400, {
				key: 'tuya.protocolVersion.invalid',
				message: 'Invalid protocol version'
			});
		}

		this.config.clientId = clientId;
		this.config.clientSecret = clientSecret;
		this.config.deviceIp = deviceIp;
		this.config.protocolVersion = protocolVersion;
	}

	public async getData({ url }: ServiceGetDataOptions): Promise<TuyaServiceMainData> {
		if (!ENABLED) {
			error(400, {
				message: `TUYA is disabled`,
				key: 'tuya.disabled'
			});
		}

		const device = new TuyAPI({
			id: this.config.clientId,
			key: this.config.clientSecret,
			ip: this.config.deviceIp,
			version: this.config.protocolVersion,
			issueGetOnConnect: false
		});

		const forceUpdate = url.searchParams.has('force');

		const data = await this.cache.with(
			{
				key: this.config.clientId,
				force: forceUpdate,
				resultCacheTime: this.config.resultCacheTime,
				errorCacheTime: this.config.errorCacheTime
			},
			async () => {
				await device.find();
				this.logger.debug('Device found');

				const status = await new Promise<string | number | boolean | DPSObject>(
					(resolve, reject) => {
						const onError = (err: Error) => reject(err);
						device.on('error', onError);
						device
							.connect()
							.then(() => {
								this.logger.debug('Device connected');
								device.get({ schema: true }).then(resolve);
							})
							.catch(() => {});
					}
				);
				this.logger.debug(`Status ${JSON.stringify(status)}`);

				if (typeof status !== 'object') {
					error(500, {
						message: 'Could not parse TUYA data',
						key: 'tuya.status.invalid'
					});
				}

				const info: any = {};
				for (const [id, { key, map }] of PROP_MAP) {
					info[key] = map(status.dps[id]);
				}

				return {
					ts: new Date(),
					info
				};
			},
			async () => {
				device.disconnect();
				this.logger.debug('Device disconnected');
			}
		);

		return {
			ts: data.ts,
			type: 'data',
			info: data.info
		};
	}
}

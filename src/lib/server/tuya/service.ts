import TuyAPI, { type DPSObject } from 'tuyapi';
import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

import {
	PROP_MAP,
	TUYA_SERVICE_TYPE,
	type TuyaServiceConfig,
	type TuyaServiceData
} from '$lib/models/tuya';

import { BaseService } from '../BaseService';

const ENABLED = env.TUYA_ENABLED === '1';

class TuyaService extends BaseService<TuyaServiceConfig, TuyaServiceData> {
	public override readonly type = TUYA_SERVICE_TYPE;

	public constructor() {
		super('TUYA');
	}

	public get(
		name: string,
		config: TuyaServiceConfig,
		forceUpdate?: boolean | undefined
	): Promise<TuyaServiceData> {
		const device = new TuyAPI({
			id: config.clientId,
			key: config.clientSecret,
			ip: config.deviceIp,
			version: config.protocolVersion,
			issueGetOnConnect: false
		});

		return this.cache.with(
			{
				key: config.clientId,
				force: forceUpdate,
				resultCacheTime: config.resultCacheTime,
				errorCacheTime: config.errorCacheTime
			},
			async () => {
				if (!ENABLED) {
					throw error(400, {
						message: `TUYA is disabled`,
						key: 'tuya.disabled'
					});
				}

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
					throw error(500, {
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
					name,
					info
				};
			},
			async () => {
				device.disconnect();
				this.logger.debug('Device disconnected');
			}
		);
	}

	public async validate(name: string, config: FormData): Promise<TuyaServiceConfig> {
		const clientId = config.get('clientId');
		if (typeof clientId !== 'string') {
			throw new Error('Invalid client id');
		}

		const clientSecret = config.get('clientSecret');
		if (typeof clientSecret !== 'string') {
			throw new Error('Invalid client secret');
		}

		const deviceIp = config.get('deviceIp');
		if (typeof deviceIp !== 'string') {
			throw new Error('Invalid device ip');
		}

		const protocolVersion = config.get('protocolVersion');
		if (typeof protocolVersion !== 'string') {
			throw new Error('Invalid protocol version');
		}

		return {
			clientId,
			clientSecret,
			deviceIp,
			protocolVersion
		};
	}
}

export default new TuyaService();

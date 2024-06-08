import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

import {
	PRUSA_SERVICE_TYPE,
	type PrusaServiceConfig,
	type PrusaServiceData,
	type PrusaServiceInstance
} from '$lib/models/prusa';

import { BaseService } from '../BaseService';

const ENABLED = env.PRUSA_ENABLED === '1';

class PrusaService extends BaseService<PrusaServiceConfig, PrusaServiceData> {
	public override readonly type = PRUSA_SERVICE_TYPE;

	public constructor() {
		super('PRUSA');
	}

	public get(
		{ name, config }: PrusaServiceInstance,
		forceUpdate?: boolean | undefined
	): Promise<PrusaServiceData> {
		return this.cache.with(
			{
				key: config.apiUrl,
				force: forceUpdate,
				resultCacheTime: config.resultCacheTime,
				errorCacheTime: config.errorCacheTime
			},
			async () => {
				if (!ENABLED) {
					error(400, {
						message: `Prusa is disabled`,
						key: 'prusa.disabled'
					});
				}

				const statusUrl = `${config.apiUrl}/api/v1/status`;
				const res = await fetch(statusUrl, { headers: { 'X-API-Key': config.apiKey } });
				const body = await res.json();

				return {
					ts: new Date(),
					name,
					...body
				};
			}
		);
	}

	public async validate(
		instance: PrusaServiceInstance,
		config: FormData
	): Promise<PrusaServiceConfig> {
		const apiUrl = config.get('apiUrl');
		if (typeof apiUrl !== 'string') {
			throw new Error('Invalid api url');
		}

		const apiKey = config.get('apiKey');
		if (typeof apiKey !== 'string') {
			throw new Error('Invalid api key');
		}

		const statusUrl = `${apiUrl}/api/v1/status`;
		const res = await fetch(statusUrl, { headers: { 'X-API-Key': apiKey } });
		if (res.status !== 200) {
			throw new Error('Invalid config: ' + res.statusText);
		}

		return {
			apiUrl,
			apiKey
		};
	}
}

export default new PrusaService();

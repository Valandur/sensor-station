import { error, fail } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

import type { ServiceActionFailure } from '$lib/models/service';
import {
	PRUSA_SERVICE_ACTIONS,
	PRUSA_SERVICE_TYPE,
	type JobInfo,
	type PrinterInfo,
	type PrusaServiceAction,
	type PrusaServiceConfig,
	type PrusaServiceConfigData,
	type PrusaServiceMainData,
	type StorageInfo
} from '$lib/models/prusa';

import { Cache } from '../Cache';
import {
	BaseService,
	type ServiceActions,
	type ServiceGetDataOptions,
	type ServiceSetDataOptions
} from '../BaseService';

interface CacheData {
	ts: Date;
	job: JobInfo;
	storage: StorageInfo;
	printer: PrinterInfo;
}

const ENABLED = env.PRUSA_ENABLED === '1';

export class PrusaService extends BaseService<PrusaServiceAction, PrusaServiceConfig> {
	public static readonly actions = PRUSA_SERVICE_ACTIONS;
	public override readonly type = PRUSA_SERVICE_TYPE;

	protected readonly cache: Cache<CacheData> = new Cache(this.logger);

	protected getDefaultConfig(): PrusaServiceConfig {
		return {
			apiKey: '',
			apiUrl: ''
		};
	}

	protected getActions(): ServiceActions<PrusaServiceAction> {
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

	public async getConfig(_: ServiceGetDataOptions): Promise<PrusaServiceConfigData> {
		if (!ENABLED) {
			error(400, `Prusa is disabled`);
		}

		return {
			ts: new Date(),
			type: 'config',
			config: this.config
		};
	}

	public async setConfig({ form }: ServiceSetDataOptions): Promise<void | ServiceActionFailure> {
		const apiUrl = form.get('apiUrl');
		if (typeof apiUrl !== 'string') {
			return fail(400, { message: 'Invalid API url' });
		}

		const apiKey = form.get('apiKey');
		if (typeof apiKey !== 'string') {
			return fail(400, { message: 'Invalid API key' });
		}

		const statusUrl = `${apiUrl}/api/v1/status`;
		const res = await fetch(statusUrl, { headers: { 'X-API-Key': apiKey } });
		if (res.status !== 200) {
			return fail(400, { message: 'Could not contact printer API' });
		}

		this.config.apiUrl = apiUrl;
		this.config.apiKey = apiKey;
	}

	public async getData({ url }: ServiceGetDataOptions): Promise<PrusaServiceMainData> {
		if (!ENABLED) {
			error(400, `Prusa is disabled`);
		}

		const forceUpdate = url.searchParams.has('force');

		const data = await this.cache.with(
			{
				key: this.config.apiUrl,
				force: forceUpdate,
				resultCacheTime: this.config.resultCacheTime,
				errorCacheTime: this.config.errorCacheTime
			},
			async () => {
				const statusUrl = `${this.config.apiUrl}/api/v1/status`;
				const res = await fetch(statusUrl, { headers: { 'X-API-Key': this.config.apiKey } });
				const body = await res.json();

				return {
					ts: new Date(),
					...body
				};
			}
		);

		return {
			ts: data.ts,
			type: 'data',
			job: data.job,
			printer: data.printer,
			storage: data.storage
		};
	}
}

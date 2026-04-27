import { error, fail } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

import {
	PRUSA_SERVICE_ACTIONS,
	PRUSA_SERVICE_TYPE,
	type JobInfo,
	type PrinterInfo,
	type PrusaServiceConfig,
	type StorageInfo
} from '$lib/models/prusa';

import { Cache } from './cache';
import { BaseService } from './service';

interface CacheData {
	ts: Date;
	job: JobInfo;
	storage: StorageInfo;
	printer: PrinterInfo;
}

const ENABLED = env.PRUSA_ENABLED === '1';

export class PrusaService extends BaseService<PrusaServiceConfig> {
	public static readonly actions = PRUSA_SERVICE_ACTIONS;
	public override readonly type = PRUSA_SERVICE_TYPE;

	protected readonly cache: Cache<CacheData> = new Cache(this.logger);

	protected getDefaultConfig(): PrusaServiceConfig {
		return {
			apiKey: '',
			apiUrl: ''
		};
	}

	public async getConfig() {
		if (!ENABLED) {
			error(400, `Prusa is disabled`);
		}

		return this.config;
	}

	public async setConfig({
		apiUrl,
		apiKey,
		resultCacheTime,
		errorCacheTime
	}: {
		apiUrl: string;
		apiKey: string;
		resultCacheTime: number;
		errorCacheTime: number;
	}) {
		const statusUrl = `${apiUrl}/api/v1/status`;
		const res = await fetch(statusUrl, { headers: { 'X-API-Key': apiKey } });
		if (res.status !== 200) {
			console.log(res);
			return fail(400, { message: 'Could not contact printer API' });
		}

		this.config.apiUrl = apiUrl;
		this.config.apiKey = apiKey;
		this.config.resultCacheTime = resultCacheTime;
		this.config.errorCacheTime = errorCacheTime;
	}

	public async getStatus({ forceUpdate, embedded }: { forceUpdate?: boolean; embedded?: boolean }) {
		if (!ENABLED) {
			error(400, `Prusa is disabled`);
		}

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

		if (!data.job && embedded) {
			error(404, 'No current print job');
		}

		return {
			ts: data.ts,
			job: data.job,
			printer: data.printer,
			storage: data.storage
		};
	}
}

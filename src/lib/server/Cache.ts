import { type HttpError } from '@sveltejs/kit';
import { differenceInSeconds } from 'date-fns';
import { env } from '$env/dynamic/private';

import type { Logger } from './Logger';

const DEFAULT_KEY = '__default__';
const DEFAULT_RESULT_CACHE_TIME = Number(env.CACHE_DEFAULT_RESULT_CACHE_TIME);
const DEFAULT_ERROR_CACHE_TIME = Number(env.CACHE_DEFAULT_ERROR_CACHE_TIME);

interface CacheEntry<T = unknown> {
	updatedAt: Date;
	data: T | null;
	error: HttpError | null;
}

interface CacheOptions {
	key?: string;
	force?: boolean;
	resultCacheTime?: number;
	errorCacheTime?: number;
}

export class Cache<T> {
	private readonly logger: Logger;

	protected readonly cache: Map<string, CacheEntry<T>> = new Map();

	public constructor(logger: Logger) {
		this.logger = logger;
	}

	public getDefaultData(): T | null {
		return this.getData(DEFAULT_KEY);
	}

	public getTs(key: string): Date | null {
		return this.cache.get(key)?.updatedAt || null;
	}

	public getData(key: string): T | null {
		return this.cache.get(key)?.data || null;
	}

	public async with(
		options: CacheOptions,
		onTry: (prev: T | null) => Promise<T>,
		onFinally?: () => Promise<void>,
		onCatch?: (err: HttpError) => Promise<void>
	): Promise<T> {
		const key = options.key ?? DEFAULT_KEY;
		const cacheEntry = this.cache.get(key);
		let updatedAt = cacheEntry?.updatedAt || new Date(0);
		let cachedData: T | null = cacheEntry?.data || null;
		let cachedError = cacheEntry?.error || null;

		if (!options.force) {
			const timeDiff = differenceInSeconds(new Date(), updatedAt);
			if (cachedData && timeDiff <= (options.resultCacheTime ?? DEFAULT_RESULT_CACHE_TIME)) {
				this.logger.debug('Using cached data');
				return cachedData;
			} else if (cachedError && timeDiff <= (options.errorCacheTime ?? DEFAULT_ERROR_CACHE_TIME)) {
				this.logger.debug('Using cached error');
				throw cachedError;
			}
		}

		this.logger.debug('Updating...');
		const startTime = process.hrtime.bigint();

		try {
			const newData = await onTry(cachedData);

			cachedData = newData;
			cachedError = null;
			return cachedData;
		} catch (err) {
			cachedError = this.logger.toSvelteError(err);
			if (onCatch) {
				await onCatch(cachedError).catch((err) => this.logger.warn('Catch error', err));
			}
			throw cachedError;
		} finally {
			if (onFinally) {
				await onFinally().catch((err) => this.logger.warn('Finally error', err));
			}

			updatedAt = new Date();
			this.cache.set(key, { updatedAt, data: cachedData, error: cachedError });

			const diffTime = (process.hrtime.bigint() - startTime) / 1000000n;
			this.logger.info('Updated', diffTime, 'ms');
		}
	}
}

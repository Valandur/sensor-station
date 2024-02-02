import { error, type HttpError } from '@sveltejs/kit';
import { differenceInSeconds } from 'date-fns';

import type { BaseLogger } from './BaseLogger';
import type { BaseCacheEntry } from './BaseCacheEntry';

const DEFAULT_KEY = '__default__';

export class BaseCache<T> {
	private readonly logger: BaseLogger;
	private readonly cacheTime: number;
	private readonly errorCacheTime: number;

	protected readonly cache: Map<string, BaseCacheEntry<T>> = new Map();

	public constructor(logger: BaseLogger, cacheTime: number, errorCacheTime = 60) {
		this.logger = logger;
		this.cacheTime = cacheTime;
		this.errorCacheTime = errorCacheTime;
	}

	public getDefaultData(): T | null {
		return this.getData(DEFAULT_KEY);
	}

	public getData(key: string): T | null {
		return this.cache.get(key)?.data || null;
	}

	public async withDefault(
		force: boolean,
		onTry: () => Promise<T>,
		onFinally?: () => Promise<void>,
		onCatch?: (err: HttpError) => Promise<void>
	): Promise<T> {
		return this.with(DEFAULT_KEY, force, onTry, onFinally, onCatch);
	}

	public async with(
		key: string,
		force: boolean,
		onTry: () => Promise<T>,
		onFinally?: () => Promise<void>,
		onCatch?: (err: HttpError) => Promise<void>
	): Promise<T> {
		const cacheEntry = this.cache.get(key);
		let updatedAt = cacheEntry?.updatedAt || new Date(0);
		let cachedData: T | null = cacheEntry?.data || null;
		let cachedError = cacheEntry?.error || null;

		if (!force) {
			const timeDiff = differenceInSeconds(new Date(), updatedAt);
			if (cachedData && timeDiff <= this.cacheTime) {
				this.logger.debug('Using cached data');
				return cachedData;
			} else if (cachedError && timeDiff <= this.errorCacheTime) {
				this.logger.debug('Using cached error');
				throw cachedError;
			}
		}

		this.logger.debug('Updating...');
		const startTime = process.hrtime.bigint();

		try {
			const newData = await onTry();

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
				await onFinally().catch((err) => this.logger.warn('Cleanup error', err));
			}

			updatedAt = new Date();
			this.cache.set(key, { updatedAt, data: cachedData, error: cachedError });

			const diffTime = (process.hrtime.bigint() - startTime) / 1000000n;
			this.logger.info('Updated', diffTime, 'ms');
		}
	}
}

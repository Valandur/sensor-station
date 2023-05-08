import type { HttpError } from '@sveltejs/kit';

export interface BaseCacheEntry<T = unknown> {
	updatedAt: Date;
	data: T | null;
	error: HttpError | null;
}

import type { Counter } from '$lib/counter';

import type { NewsFeedItem } from './NewsFeedItem';

export interface NewsFeed {
	cachedAt: Date;
	items: NewsFeedItem[];
	counter: Counter;
}

import { Counter, CounterType } from '$lib/counter';
import { getData } from '$lib/server/news/data';

import type { PageServerLoad } from './$types';

const MAX_SLICE_SIZE = 3;
const counters: Map<string, Counter> = new Map();

export const load: PageServerLoad = async ({ url, params, parent }) => {
	const feedId = params.feed;

	let counter = counters.get(feedId);
	if (!counter) {
		counter = new Counter({
			type: CounterType.Wrap,
			maxSliceSize: MAX_SLICE_SIZE
		});
		counters.set(feedId, counter);
	}

	const data = await getData(feedId);
	counter.max = data.items.length;

	let page = Number(url.searchParams.get('page') || '---');
	if (!isFinite(page)) {
		page = counter.increment();
	}

	const items = counter.slice(data.items, page);
	const dataParent = await parent();

	return {
		feedId,
		items,
		nextPage: `${dataParent.currScreen}&page=${counter.fit(page + 1)}`,
		prevPage: `${dataParent.currScreen}&page=${counter.fit(page - 1)}`
	};
};

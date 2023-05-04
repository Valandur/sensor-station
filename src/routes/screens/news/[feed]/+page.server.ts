import { env } from '$env/dynamic/private';
import { redirect } from '@sveltejs/kit';

import { getFeed } from '$lib/server/news';

import type { PageServerLoad } from './$types';

const ENABLED = env.NEWS_ENABLED === '1';
const MAX_ITEMS = 3;

export const load: PageServerLoad = async ({ url, params, parent }) => {
	if (!ENABLED) {
		throw redirect(302, '/screens');
	}

	const feedId = params.feed;
	let page = Number(url.searchParams.get('page') || '-');

	const feed = await getFeed(feedId);

	if (!isFinite(page)) {
		page = feed.counter.increment();
	}

	const items = feed.counter.sliceAndWrap(feed.items, MAX_ITEMS, page);
	const dataParent = await parent();

	return {
		feedId,
		items,
		nextPage: `${dataParent.currScreen}&page=${feed.counter.wrap(page + 1)}`,
		prevPage: `${dataParent.currScreen}&page=${feed.counter.wrap(page - 1)}`
	};
};

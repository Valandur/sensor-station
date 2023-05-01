import { differenceInSeconds, parse } from 'date-fns';
import { env } from '$env/dynamic/private';
import { error, redirect } from '@sveltejs/kit';
import Parser from 'rss-parser';

import { Counter } from '$lib/counter';
import type { NewsFeed } from '$lib/models/NewsFeed';
import type { NewsFeedItem } from '$lib/models/NewsFeedItem';

import type { PageServerLoad } from './$types';

const ENABLED = env.NEWS_ENABLED === '1';
const CACHE_TIME = Number(env.NEWS_CACHE_TIME);
const MAX_ITEMS = 3;
const MATCHER = /<img src="https:\/\/www.srf.ch\/static\/cms\/images\/(.*?)".*?>(.*)/;

export const load: PageServerLoad = async ({ url, params, parent }) => {
	if (!ENABLED) {
		throw redirect(302, '/screens');
	}

	try {
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
	} catch (err: unknown) {
		console.error(err);
		throw error(500, (err as Error).message);
	}
};

const feeds: Map<string, NewsFeed> = new Map();

async function getFeed(feedId: string): Promise<NewsFeed> {
	let feed = feeds.get(feedId);
	if (feed && differenceInSeconds(new Date(), feed.cachedAt) <= CACHE_TIME) {
		return feed;
	}

	const parser = new Parser({ customFields: { item: ['description'] } });
	const xmlFeed = await parser.parseURL(`https://www.srf.ch/news/bnf/rss/${feedId}`);

	const items: NewsFeedItem[] = [];
	const rawItems = xmlFeed.items
		.filter((item) => !item.description.includes('Hier finden Sie'))
		.slice(0, 10);
	for (const item of rawItems) {
		if (!item.guid || !item.title || !item.link) {
			continue;
		}

		const match = MATCHER.exec(item.description);
		if (!match) {
			continue;
		}

		const [, img, content] = match;
		const date = item.pubDate
			? parse(item.pubDate.substring(5), 'dd MMM yyyy HH:mm:ss x', new Date())
			: new Date();

		items.push({
			ts: date,
			title: item.title,
			link: Buffer.from(item.link, 'utf-8').toString('base64url'),
			content: content || '',
			img: `https://www.srf.ch/static/cms/images/${img}`
		});
	}

	feed = { cachedAt: new Date(), items, counter: feed?.counter || new Counter() };
	feed.counter.max = items.length;
	feeds.set(feedId, feed);
	return feed;
}

import { differenceInSeconds, parse } from 'date-fns';
import { env } from '$env/dynamic/private';
import Parser from 'rss-parser';
import superagent from 'superagent';

import { Counter } from '$lib/counter';
import type { NewsFeed } from '$lib/models/NewsFeed';
import type { NewsFeedItem } from '$lib/models/NewsFeedItem';

export const ENABLED = env.NEWS_ENABLED === '1';
export const SIMPLE_DETAILS = env.NEWS_SIMPLE_DETAILS === '1';
const CACHE_TIME = Number(env.NEWS_CACHE_TIME);
const DESCRIPTION_MATCHER = /<img src="https:\/\/www.srf.ch\/static\/cms\/images\/(.*?)".*?>(.*)/;
const MEDIA_MATCHER = /<div class="js-media"\W*?data-app-video/;

const feeds: Map<string, NewsFeed> = new Map();

export async function getFeed(feedId: string): Promise<NewsFeed> {
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

		const match = DESCRIPTION_MATCHER.exec(item.description);
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

export async function getArticle(
	rawLink: string
): Promise<{ head: string; main: string; scripts: string }> {
	const link = Buffer.from(rawLink, 'base64url').toString('utf-8');

	const { text } = await superagent.get(link);
	const page = text;

	const headStart = page.indexOf('<head>') + 6;
	const headEnd = page.indexOf('<script>', headStart);
	const head = page.substring(headStart, headEnd);

	const mainStart = SIMPLE_DETAILS
		? page.indexOf('<section')
		: page.indexOf('>', page.indexOf('<main')) + 1;
	const mainEnd = page.indexOf('</section>', mainStart) + 7;
	let main = page.substring(mainStart, mainEnd);

	if (SIMPLE_DETAILS) {
		let mediaStart: number;
		while ((mediaStart = MEDIA_MATCHER.exec(main)?.index || -1) >= 0) {
			let mediaEnd = main.indexOf('<span class="h-offscreen">abspielen', mediaStart);
			for (let i = 0; i < 4; i++) {
				mediaEnd = main.indexOf('</div>', mediaEnd) + 6;
			}
			main = main.substring(0, mediaStart) + main.substring(mediaEnd);
		}
	}

	let scripts = '';
	if (!SIMPLE_DETAILS) {
		const scriptStart = page.lastIndexOf('<span id="config__js"');
		const scriptEnd = page.indexOf('</body>', scriptStart);
		scripts = page.substring(scriptStart, scriptEnd);
	}

	return {
		head,
		main,
		scripts
	};
}

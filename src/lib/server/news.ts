import { basename } from 'node:path';
import { createHash } from 'node:crypto';
import { createWriteStream } from 'node:fs';
import { differenceInSeconds, parse } from 'date-fns';
import { error } from '@sveltejs/kit';
import { mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { parse as parseHtml } from 'node-html-parser';
import Parser from 'rss-parser';
import superagent from 'superagent';

import { env } from '$env/dynamic/private';

import { Counter } from '$lib/counter';
import { Logger } from '$lib/logger';
import type { NewsFeed } from '$lib/models/NewsFeed';
import type { NewsFeedItem } from '$lib/models/NewsFeedItem';

export const ENABLED = env.NEWS_ENABLED === '1';
export const SIMPLE_DETAILS = env.NEWS_SIMPLE_DETAILS === '1';
const CACHE_TIME = Number(env.NEWS_CACHE_TIME);
const CACHE_PATH = 'data/news';
const DESCRIPTION_MATCHER = /<img src="https:\/\/www.srf.ch\/static\/cms\/images\/(.*?)".*?>(.*)/;

const logger = new Logger('NEWS');
const feeds: Map<string, NewsFeed> = new Map();

export async function getFeed(feedId: string): Promise<NewsFeed> {
	if (!ENABLED) {
		throw error(400, { message: 'News module is disabled', key: 'news.disabled' });
	}

	let feed = feeds.get(feedId);
	if (feed && differenceInSeconds(new Date(), feed.cachedAt) <= CACHE_TIME) {
		logger.debug('Using cached feed', feedId);
		return feed;
	}

	logger.info('Fetching feed', feedId);
	const startTime = process.hrtime.bigint();

	try {
		await mkdir(`${CACHE_PATH}/${feedId}`, { recursive: true });

		const { text } = await superagent.get(`https://www.srf.ch/news/bnf/rss/${feedId}`);

		const parser = new Parser({ customFields: { item: ['description'] } });
		const xmlFeed = await parser.parseString(text);

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

			const id = createHash('shake256', { outputLength: 8 }).update(item.guid).digest('hex');
			const [, imgUrl, content] = match;
			const date = item.pubDate
				? parse(item.pubDate.substring(5), 'dd MMM yyyy HH:mm:ss x', new Date())
				: new Date();

			await mkdir(`${CACHE_PATH}/${feedId}/${id}`, { recursive: true });
			const imgFileName = `${feedId}/${id}/${basename(imgUrl)}`;
			const imgFilePath = `${CACHE_PATH}/${imgFileName}`;

			if (!(await stat(imgFilePath).catch(() => null))) {
				const stream = createWriteStream(imgFilePath);
				superagent.get(`https://www.srf.ch/static/cms/images/${imgUrl}`).pipe(stream);
				await new Promise<void>((resolve) => stream.on('finish', () => resolve()));
			}

			items.push({
				id,
				ts: date,
				title: item.title,
				link: item.link,
				content: content || '',
				image: imgFileName
			});
		}

		const articles = await readdir(`${CACHE_PATH}/${feedId}`);
		for (const fileName of articles) {
			if (!items.some((item) => item.id === fileName)) {
				await rm(`${CACHE_PATH}/${feedId}/${fileName}`, { recursive: true, force: true });
			}
		}

		feed = { cachedAt: new Date(), items, counter: feed?.counter || new Counter() };
		feed.counter.max = items.length;
		feeds.set(feedId, feed);

		return feed;
	} catch (err) {
		throw logger.toSvelteError(err);
	} finally {
		const diffTime = (process.hrtime.bigint() - startTime) / 1000000n;
		logger.info('Updated', diffTime, 'ms');
	}
}

export async function getArticle(
	feedId: string,
	articleId: string
): Promise<{ head: string; body: string }> {
	if (!ENABLED) {
		throw error(400, { message: 'News module is disabled', key: 'news.disabled' });
	}

	const article = feeds.get(feedId)?.items.find((item) => item.id === articleId);
	if (!article) {
		throw error(404, {
			message: `Article ${articleId} in feed ${feedId} could not be found`,
			key: 'news.articleNotFound',
			params: { feedId, articleId }
		});
	}

	logger.debug('Updating article', feedId, articleId);
	const startTime = process.hrtime.bigint();

	try {
		let page = '';

		const filePath = `${CACHE_PATH}/${feedId}/${articleId}/article.html`;
		if (await stat(filePath).catch(() => null)) {
			logger.debug('Using cached article file', feedId, articleId);
			page = await readFile(filePath, 'utf-8');
		} else {
			logger.debug('Downloading article file', feedId, articleId);
			const { text } = await superagent.get(article.link);
			await writeFile(filePath, text, 'utf-8');
			page = text;
		}

		const html = parseHtml(page);
		const head = html.getElementsByTagName('head')[0];
		for (const script of head.getElementsByTagName('script')) {
			script.remove();
		}

		const body = html.getElementsByTagName('body')[0];
		const main = body.getElementsByTagName('main')[0];
		const title = main.getElementsByTagName('header')[0];
		const section = main.getElementsByTagName('section')[0];

		if (SIMPLE_DETAILS) {
			// strip divs
			for (const div of body.getElementsByTagName('div')) {
				div.replaceWith('<span class="badge bg-dark mb-3">Element entfernt</span>');
			}
			// strip images
			for (const figure of body.getElementsByTagName('figure')) {
				figure.replaceWith('<span class="badge bg-dark mb-3">Bild/Video entfernt</span>');
			}
			// strip link in title
			title.getElementById('skiplink__contentlink')?.remove();

			body.childNodes = [title, section];
		} else {
			const header = main.getElementsByTagName('div')[0];
			const section = main.getElementsByTagName('section')[0];
			const config = body.getElementById('config__js');
			const scripts = body.getElementsByTagName('script');
			body.childNodes = [header, title, section, config, ...scripts];
		}

		return { head: head.innerHTML, body: body.innerHTML.toString() };
	} catch (err) {
		throw logger.toSvelteError(err, { embedded: true });
	} finally {
		const diffTime = (process.hrtime.bigint() - startTime) / 1000000n;
		logger.info('Updated article', feedId, articleId, diffTime, 'ms');
	}
}

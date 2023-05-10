import { basename } from 'node:path';
import { createHash } from 'node:crypto';
import { createWriteStream } from 'node:fs';
import { error } from '@sveltejs/kit';
import { mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { parse } from 'date-fns';
import { parse as parseHtml } from 'node-html-parser';
import Parser from 'rss-parser';
import superagent from 'superagent';

import { env } from '$env/dynamic/private';

import { BaseCache } from '$lib/models/BaseCache';
import { BaseLogger } from '$lib/models/BaseLogger';
import type { NewsArticleData } from '$lib/models/NewsArticleData';
import type { NewsData } from '$lib/models/NewsData';
import type { NewsItem } from '$lib/models/NewsItem';

const ENABLED = env.NEWS_ENABLED === '1';
const SIMPLE_DETAILS = env.NEWS_SIMPLE_DETAILS === '1';
const CACHE_TIME = Number(env.NEWS_CACHE_TIME);
const CACHE_PATH = 'data/news';
const BASE_URL = `https://www.srf.ch/news/bnf/rss/`;
const DESCR_REGEX = /<img src="https:\/\/www.srf.ch\/static\/cms\/images\/(.*?)".*?>(.*)/;

export { SIMPLE_DETAILS };

const logger = new BaseLogger('NEWS');
const feedCache = new BaseCache<NewsData>(logger, CACHE_TIME);
const articleCache = new BaseCache<NewsArticleData>(logger, CACHE_TIME);

export function getData(feedId: string, forceUpdate = false) {
	return feedCache.with(feedId, forceUpdate, async () => {
		if (!ENABLED) {
			throw error(400, {
				message: `News is disabled`,
				key: 'news.disabled'
			});
		}

		await mkdir(`${CACHE_PATH}/${feedId}`, { recursive: true });

		const { text } = await superagent.get(`${BASE_URL}${feedId}`);

		const parser = new Parser({ customFields: { item: ['description'] } });
		const xmlFeed = await parser.parseString(text);

		const items: NewsItem[] = [];
		const rawItems = xmlFeed.items
			.filter((item) => !item.description.includes('Hier finden Sie'))
			.slice(0, 10);

		for (const item of rawItems) {
			if (!item.guid || !item.title || !item.link) {
				continue;
			}

			const match = DESCR_REGEX.exec(item.description);
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
				await rm(`${CACHE_PATH}/${feedId}/${fileName}`, {
					recursive: true,
					force: true
				});
			}
		}

		return {
			ts: new Date(),
			items
		};
	});
}

export async function getArticle(feedId: string, articleId: string, forceUpdate = false) {
	return articleCache.with(
		`${feedId}-${articleId}`,
		forceUpdate,
		async () => {
			if (!ENABLED) {
				throw error(400, {
					message: `News is disabled`,
					key: 'news.disabled'
				});
			}

			const feedData = feedCache.getData(feedId);
			if (!feedData) {
				throw error(400, {
					message: `Feed ${feedId} not loaded`,
					key: 'news.feedNotLoaded',
					params: { feedId, articleId }
				});
			}

			let page = '';
			const article = feedData.items.find((a) => a.id === articleId);
			if (!article) {
				throw error(400, {
					message: `Article ${articleId} in feed ${feedId} not found`,
					key: 'news.articleNotFound',
					params: { feedId, articleId }
				});
			}

			const filePath = `${CACHE_PATH}/${feedId}/${article.id}/article.html`;
			if (await stat(filePath).catch(() => null)) {
				logger.debug('Using cached article file', feedId, article.id);
				page = await readFile(filePath, 'utf-8');
			} else {
				logger.debug('Downloading article file', feedId, article.id);
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

			return {
				ts: new Date(),
				head: head.innerHTML,
				body: body.innerHTML.toString()
			};
		},
		undefined,
		async (err) => {
			err.body.embedded = true;
		}
	);
}

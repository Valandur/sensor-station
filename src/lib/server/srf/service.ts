import { basename } from 'node:path';
import { createHash } from 'node:crypto';
import { createWriteStream } from 'node:fs';
import { finished } from 'node:stream/promises';
import { Readable } from 'node:stream';
import type { ReadableStream } from 'node:stream/web';
import { error } from '@sveltejs/kit';
import { mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { parse } from 'date-fns';
import { parse as parseHtml } from 'node-html-parser';
import Parser from 'rss-parser';

import { env } from '$env/dynamic/private';

import { BaseService } from '../BaseService';
import {
	SRF_SERVICE_TYPE,
	type NewsItem,
	type SrfServiceConfig,
	type SrfServiceData
} from '$lib/models/srf';

const ENABLED = env.SRF_ENABLED === '1';
const CACHE_PATH = 'data/news';
const BASE_URL = `https://www.srf.ch/news/bnf/rss/`;
const DESCR_REGEX = /<img src="(.*?)".*?>(.*)/;

class SrfService extends BaseService<SrfServiceConfig, SrfServiceData> {
	public override readonly type = SRF_SERVICE_TYPE;

	public constructor() {
		super('SRF');
	}

	public get(
		name: string,
		config: SrfServiceConfig,
		forceUpdate?: boolean | undefined
	): Promise<SrfServiceData> {
		return this.cache.with(
			{
				key: config.feedId,
				force: forceUpdate,
				resultCacheTime: config.resultCacheTime,
				errorCacheTime: config.errorCacheTime
			},
			async () => {
				if (!ENABLED) {
					throw error(400, {
						message: `SRF is disabled`,
						key: 'srf.disabled'
					});
				}

				await mkdir(`${CACHE_PATH}/${config.feedId}`, { recursive: true });

				const res = await fetch(`${BASE_URL}${config.feedId}`);
				const text = await res.text();

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

					await mkdir(`${CACHE_PATH}/${config.feedId}/${id}`, { recursive: true });
					const imgFileName = `${config.feedId}/${id}/${basename(imgUrl)}`;
					const imgFilePath = `${CACHE_PATH}/${imgFileName}`;

					if (!(await stat(imgFilePath).catch(() => null))) {
						const res = await fetch(imgUrl);
						const stream = createWriteStream(imgFilePath);
						await finished(Readable.fromWeb(res.body as ReadableStream<Uint8Array>).pipe(stream));
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

				const articles = await readdir(`${CACHE_PATH}/${config.feedId}`);
				for (const fileName of articles) {
					if (!items.some((item) => item.id === fileName)) {
						await rm(`${CACHE_PATH}/${config.feedId}/${fileName}`, {
							recursive: true,
							force: true
						});
					}
				}

				return {
					ts: new Date(),
					name,
					feedId: config.feedId,
					items
				};
			}
		);
	}

	public async validate(name: string, config: FormData): Promise<SrfServiceConfig> {
		const feedId = config.get('feedId');
		if (typeof feedId !== 'string') {
			throw new Error('Invalid feed ID');
		}

		const res = await fetch(`${BASE_URL}${feedId}`);
		if (res.status === 404) {
			throw new Error('Unknown feed ID');
		} else if (res.status !== 200) {
			throw new Error('Invalid config: ' + res.statusText);
		}

		return {
			feedId
		};
	}
}

export default new SrfService();

/*
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
*/

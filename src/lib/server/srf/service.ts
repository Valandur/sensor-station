import { basename } from 'node:path';
import { createHash } from 'node:crypto';
import { createWriteStream } from 'node:fs';
import { mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { Readable } from 'node:stream';
import { finished } from 'node:stream/promises';
import type { ReadableStream } from 'node:stream/web';
import { error } from '@sveltejs/kit';
import { parse } from 'date-fns';
import { parse as parseHtml } from 'node-html-parser';
import Parser from 'rss-parser';
import { env } from '$env/dynamic/private';

import {
	SRF_SERVICE_TYPE,
	type NewsItem,
	type SrfServiceAction,
	type SrfServiceConfig,
	type SrfServiceData,
	type SrfServiceInstance
} from '$lib/models/srf';

import { Cache } from '../Cache';
import { BaseService } from '../BaseService';

const ENABLED = env.SRF_ENABLED === '1';
const CACHE_PATH = 'data/srf';
const BASE_URL = `https://www.srf.ch/news/bnf/rss/`;
const DESCR_REGEX = /<img src="(.*?)".*?>(.*)/;

class SrfService extends BaseService<SrfServiceConfig, SrfServiceData, SrfServiceAction> {
	public override readonly type = SRF_SERVICE_TYPE;

	protected readonly articleCache: Cache<SrfServiceAction>;

	public constructor() {
		super('SRF');

		this.articleCache = new Cache(this.logger);
	}

	public get(
		{ name, config }: SrfServiceInstance,
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
					const imgFilePath = `${CACHE_PATH}/${config.feedId}/${id}/${basename(imgUrl)}`;

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
						image: imgFilePath
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

	public async validate(instance: SrfServiceInstance, config: FormData): Promise<SrfServiceConfig> {
		const feedId = config.get('feedId');
		if (typeof feedId !== 'string') {
			throw new Error('Invalid feed ID');
		}

		const simpleDetails = config.get('simpleDetails') === 'on';

		const res = await fetch(`${BASE_URL}${feedId}`);
		if (res.status === 404) {
			throw new Error('Unknown feed ID');
		} else if (res.status !== 200) {
			throw new Error('Invalid config: ' + res.statusText);
		}

		return {
			feedId,
			simpleDetails
		};
	}

	public override async action(
		instance: SrfServiceInstance,
		action: string
	): Promise<SrfServiceAction | null> {
		const { name, config } = instance;

		return this.articleCache.with(
			{
				key: action,
				resultCacheTime: config.resultCacheTime,
				errorCacheTime: config.errorCacheTime
			},
			async () => {
				if (!ENABLED) {
					throw error(400, {
						message: `News is disabled`,
						key: 'news.disabled'
					});
				}

				const [feedId, articleId] = action.split('/', 2);

				let feedData = this.cache.getData(feedId);
				if (!feedData) {
					feedData = await this.get(instance, false);
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
					this.logger.debug('Using cached article file', feedId, article.id);
					page = await readFile(filePath, 'utf-8');
				} else {
					this.logger.debug('Downloading article file', feedId, article.id);
					const res = await fetch(article.link);
					const text = await res.text();
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

				if (config.simpleDetails) {
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
					const config = body.getElementById('config__js')!;
					const scripts = body.getElementsByTagName('script');
					body.childNodes = [header, title, section, config, ...scripts];
				}

				return {
					ts: new Date(),
					simple: config.simpleDetails,
					name,
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
}

export default new SrfService();

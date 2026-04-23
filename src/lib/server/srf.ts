import { basename } from 'node:path';
import { createHash } from 'node:crypto';
import { createWriteStream } from 'node:fs';
import { mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { Readable } from 'node:stream';
import { finished } from 'node:stream/promises';
import type { ReadableStream } from 'node:stream/web';
import { error, fail } from '@sveltejs/kit';
import { parse } from 'date-fns';
import { parse as parseHtml } from 'node-html-parser';
import Parser from 'rss-parser';
import { env } from '$env/dynamic/private';

import { wrap } from '$lib/counter';
import {
	SRF_SERVICE_TYPE,
	SRF_SERVICE_ACTIONS,
	type NewsArticle,
	type SrfServiceConfig
} from '$lib/models/srf';

import { Cache } from './cache';
import { BaseService } from './service';

interface CacheData {
	ts: Date;
	articles: NewsArticle[];
}

interface CacheDetailsData {
	ts: Date;
	simple: boolean;
	head: string;
	body: string;
}

const ENABLED = env.SRF_ENABLED === '1';
const BASE_URL = `https://www.srf.ch/news/bnf/rss/`;
const DESCR_REGEX = /<img src="(.*?)".*?>(.*)/;

export class SrfService extends BaseService<SrfServiceConfig> {
	public override readonly type = SRF_SERVICE_TYPE;
	public static readonly actions = SRF_SERVICE_ACTIONS;

	protected readonly cache: Cache<CacheData> = new Cache(this.logger);
	protected readonly detailsCache: Cache<CacheDetailsData> = new Cache(this.logger);
	protected lastPage = 0;

	protected getDefaultConfig(): SrfServiceConfig {
		return {
			feedId: '',
			simpleDetails: false,
			itemsPerPage: 3
		};
	}

	public async getConfig() {
		if (!ENABLED) {
			error(400, `SRF is disabled`);
		}

		return this.config;
	}

	public async setConfig({
		feedId,
		simpleDetails,
		itemsPerPage
	}: {
		feedId: string;
		simpleDetails: boolean;
		itemsPerPage: number;
	}) {
		const res = await fetch(`${BASE_URL}${feedId}`);
		if (res.status === 404) {
			return fail(400, { message: 'Unknown feed ID' });
		} else if (res.status !== 200) {
			return fail(400, { message: 'Invalid srf config' });
		}

		this.config.feedId = feedId;
		this.config.simpleDetails = simpleDetails;
		this.config.itemsPerPage = itemsPerPage;
	}

	public async getNews({ page, forceUpdate }: { page?: number | null; forceUpdate?: boolean }) {
		if (!ENABLED) {
			error(400, `SRF is disabled`);
		}

		if (!this.config.feedId) {
			error(400, 'Invalid srf config');
		}

		const folderPath = `data/${this.name}/${this.config.feedId}`;
		await mkdir(folderPath, { recursive: true });

		const data = await this.cache.with(
			{
				key: this.config.feedId,
				force: forceUpdate,
				resultCacheTime: this.config.resultCacheTime,
				errorCacheTime: this.config.errorCacheTime
			},
			async () => {
				const res = await fetch(`${BASE_URL}${this.config.feedId}`);
				const text = await res.text();

				const parser = new Parser({ customFields: { item: ['description'] } });
				const xmlFeed = await parser.parseString(text);

				const articles: NewsArticle[] = [];
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

					await mkdir(`${folderPath}/${id}`, { recursive: true });
					const imgFilePath = `${folderPath}/${id}/${basename(imgUrl)}`;

					if (!(await stat(imgFilePath).catch(() => null))) {
						const res = await fetch(imgUrl);
						const stream = createWriteStream(imgFilePath);
						await finished(Readable.fromWeb(res.body as ReadableStream<Uint8Array>).pipe(stream));
					}

					articles.push({
						id,
						ts: date,
						title: item.title,
						link: item.link,
						content: content || '',
						image: imgFilePath
					});
				}

				const fileNames = await readdir(folderPath);
				for (const fileName of fileNames) {
					if (!articles.some((item) => item.id === fileName)) {
						await rm(`${folderPath}/${fileName}`, { recursive: true, force: true });
					}
				}

				return {
					ts: new Date(),
					articles
				};
			}
		);

		if (typeof page !== 'number') {
			page = this.lastPage + 1;
		}

		const [articles, prevPage, nextPage, index] = wrap(
			data.articles.length,
			page,
			this.config.itemsPerPage,
			data.articles
		);
		this.lastPage = index;

		return {
			prevPage,
			nextPage,
			articles
		};
	}

	public async getDetails({
		articleId,
		forceUpdate
	}: {
		articleId: string;
		forceUpdate?: boolean;
	}) {
		if (!ENABLED) {
			error(400, `SRF is disabled`);
		}

		if (!this.config.feedId) {
			error(400, 'Invalid srf config');
		}

		const folderPath = `data/${this.name}/${this.config.feedId}`;
		await mkdir(folderPath, { recursive: true });

		const data = await this.detailsCache.with(
			{
				key: `${this.config.feedId}-${articleId}`,
				force: forceUpdate,
				resultCacheTime: this.config.resultCacheTime,
				errorCacheTime: this.config.errorCacheTime
			},
			async () => {
				const feedData = this.cache.getData(this.config.feedId);
				if (!feedData) {
					error(400, 'Cache does not contain aritcle');
				}

				let page;
				const article = feedData.articles.find((a) => a.id === articleId);
				if (!article) {
					error(400, `Article ${articleId} in feed ${this.config.feedId} not found`);
				}

				const filePath = `${folderPath}/${article.id}/article.html`;
				if (await stat(filePath).catch(() => null)) {
					this.logger.debug('Using cached article file', this.config.feedId, article.id);
					page = await readFile(filePath, 'utf-8');
				} else {
					this.logger.debug('Downloading article file', this.config.feedId, article.id);
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
				const sections = main.getElementsByTagName('section');

				if (this.config.simpleDetails) {
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

					body.childNodes = [title, ...sections];
				} else {
					const config = body.getElementById('config__js')!;
					const scripts = body.getElementsByTagName('script');
					body.childNodes = [title, ...sections, config, ...scripts];
				}

				return {
					ts: new Date(),
					simple: this.config.simpleDetails,
					head: head.innerHTML,
					body: body.innerHTML.toString()
				};
			},
			undefined,
			async (err) => {
				err.body.embedded = true;
			}
		);

		return {
			ts: data.ts,
			simple: data.simple,
			head: data.head,
			body: data.body
		};
	}
}

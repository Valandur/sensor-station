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

import type { ServiceActionFailure } from '$lib/models/service';
import {
	SRF_SERVICE_ACTIONS,
	type NewsItem,
	type SrfServiceAction,
	type SrfServiceConfig,
	type SrfServiceData
} from '$lib/models/srf';

import { Cache } from '../Cache';
import {
	BaseService,
	type ServiceGetDataOptions,
	type ServiceSetDataOptions
} from '../BaseService';

const ENABLED = env.SRF_ENABLED === '1';
const BASE_URL = `https://www.srf.ch/news/bnf/rss/`;
const DESCR_REGEX = /<img src="(.*?)".*?>(.*)/;

export class SrfService extends BaseService<SrfServiceAction, SrfServiceConfig, SrfServiceData> {
	public static readonly actions = SRF_SERVICE_ACTIONS;

	protected readonly articleCache: Cache<SrfServiceData>;

	protected generateDefaultConfig(): SrfServiceConfig {
		return {
			feedId: '',
			simpleDetails: false
		};
	}

	public constructor(name: string, type: string, config?: SrfServiceConfig) {
		super(name, type, config);
		this.articleCache = new Cache(this.logger);
	}

	public async getData(
		action: SrfServiceAction,
		{ url }: ServiceGetDataOptions
	): Promise<SrfServiceData | null> {
		if (!ENABLED) {
			error(400, {
				message: `SRF is disabled`,
				key: 'srf.disabled'
			});
		}

		if (action === 'config') {
			return {
				ts: new Date(),
				name: this.name,
				type: this.type,
				action: 'config',
				config: this.config
			};
		}

		if (!this.config.feedId) {
			error(400, {
				key: 'srf.config.invalid',
				message: 'Invalid srf config'
			});
		}

		const forceUpdate = url.searchParams.has('force');

		const folderPath = `data/${this.name}/${this.config.feedId}`;
		await mkdir(folderPath, { recursive: true });

		if (action === 'details') {
			return this.articleCache.with(
				{
					resultCacheTime: this.config.resultCacheTime,
					errorCacheTime: this.config.errorCacheTime
				},
				async () => {
					const articleId = url.searchParams.get('article');

					let feedData = this.cache.getData(this.config.feedId);
					if (!feedData || feedData.action !== '') {
						error(400, {
							key: 'srf.cache.empty',
							message: 'Cache does not contain aritcle'
						});
					}

					let page = '';
					const article = feedData.items.find((a) => a.id === articleId);
					if (!article) {
						error(400, {
							message: `Article ${articleId} in feed ${this.config.feedId} not found`,
							key: 'srf.articleNotFound'
						});
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
					const section = main.getElementsByTagName('section')[0];

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
						name: this.name,
						type: this.type,
						action: 'details',
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
		}

		return this.cache.with(
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

					await mkdir(`${folderPath}/${id}`, { recursive: true });
					const imgFilePath = `${folderPath}/${id}/${basename(imgUrl)}`;

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

				const articles = await readdir(folderPath);
				for (const fileName of articles) {
					if (!items.some((item) => item.id === fileName)) {
						await rm(`${folderPath}/${fileName}`, { recursive: true, force: true });
					}
				}

				return {
					ts: new Date(),
					name: this.name,
					type: this.type,
					action,
					items
				};
			}
		);
	}

	public async setData(
		action: SrfServiceAction,
		{ form }: ServiceSetDataOptions
	): Promise<void | ServiceActionFailure> {
		const feedId = form.get('feedId');
		if (typeof feedId !== 'string') {
			error(400, { key: 'srf.feed.invalid', message: 'Invalid feed ID' });
		}

		const simpleDetails = form.get('simpleDetails') === 'on';

		const res = await fetch(`${BASE_URL}${feedId}`);
		if (res.status === 404) {
			error(400, { key: 'srf.feed.unknown', message: 'Unknown feed ID' });
		} else if (res.status !== 200) {
			error(400, { key: 'srf.config.invalid', message: 'Invalid srf config' });
		}

		this.config.feedId = feedId;
		this.config.simpleDetails = simpleDetails;
	}
}

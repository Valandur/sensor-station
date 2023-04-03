import { parse } from 'date-fns';
import Parser from 'rss-parser';
import superagent from 'superagent';

import { Service } from './service';

const MATCHER = /<img src="https:\/\/www.srf.ch\/static\/cms\/images\/(.*?)".*?>(.*)/;

export interface NewsFeed {
	name: string;
	feedUrl: string;
	items: FeedItem[];
}

export interface FeedItem {
	id: string;
	ts: string;
	title: string;
	link: string;
	content: string;
	img: string;
}

export class News extends Service {
	private parser: Parser<{}, { description: string }> | null = null;
	private feedMap: Map<string, NewsFeed> = new Map();

	public async doInit(): Promise<void> {
		this.parser = new Parser({
			customFields: {
				item: ['description']
			}
		});
	}

	protected async doStart(): Promise<void> {
		this.feedMap = new Map();
	}

	protected override async doUpdate(): Promise<void> {
		for (const feed of this.feedMap.values()) {
			await this.updateFeed(feed);
		}
	}

	protected async doStop(): Promise<void> {
		this.feedMap.clear();
	}

	protected async doDispose(): Promise<void> {
		if (this.parser) {
			this.parser = null;
		}
	}

	private async updateFeed(newsFeed: NewsFeed) {
		if (!this.parser) {
			throw new Error(`Parser is not available`);
		}

		const feed = await this.parser.parseURL(newsFeed.feedUrl);

		const items: FeedItem[] = [];
		const feedItems = feed.items.filter((item) => !item.description.includes('Hier finden Sie')).slice(0, 10);
		for (const item of feedItems) {
			if (!item.guid || !item.title || !item.link) {
				continue;
			}

			const match = MATCHER.exec(item.description);
			if (!match) {
				continue;
			}

			const [, img, content] = match;
			const date = item.pubDate ? parse(item.pubDate.substring(5), 'dd MMM yyyy HH:mm:ss x', new Date()) : new Date();

			const id = Buffer.from(item.guid, 'utf-8').toString('base64');
			items.push({
				id,
				ts: date.toISOString(),
				title: item.title,
				link: item.link,
				content: content || '',
				img: `https://www.srf.ch/static/cms/images/${img}`
			});
		}

		newsFeed.items = items;
	}

	public async getItems(feedId: string) {
		let newsFeed = this.feedMap.get(feedId);
		if (!newsFeed) {
			this.log(`SETTING UP ${feedId}`);

			newsFeed = { name: feedId, feedUrl: `https://www.srf.ch/news/bnf/rss/${feedId}`, items: [] };
			this.feedMap.set(feedId, newsFeed);
			await this.updateFeed(newsFeed);
		}

		return newsFeed.items;
	}

	public async getArticle(feedId: string, itemId: string) {
		const link = this.feedMap.get(feedId)?.items.find((i) => i.id === itemId)?.link;
		if (!link) {
			throw new Error(`Article not found ${feedId} - ${itemId}`);
		}

		const { text } = await superagent.get(link);
		let page = text;

		const headerStart = page.indexOf('<header');
		const mainStart = page.indexOf('<!-- Begin of main wrapper');
		page = page.substring(0, headerStart) + page.substring(mainStart);

		const mainEnd = page.indexOf('<!-- end of main wrapper-->');
		const scriptStart = page.indexOf('<span id="config__js"', mainEnd);
		page = page.substring(0, mainEnd) + page.substring(scriptStart);

		const headStart = page.indexOf('<head>') + 6;
		page = page.substring(0, headStart) + '<base href="https://www.srf.ch/">' + page.substring(headStart);

		page = page.replace('<div class="affix-placeholder affix-placeholder--compact js-affix-placeholder"></div>', '');

		return page;
	}
}

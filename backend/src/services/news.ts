import axios from 'axios';
import { parse } from 'date-fns';
import Parser from 'rss-parser';

import { Service } from './service';

const MATCHER = /<img src="https:\/\/www.srf.ch\/static\/cms\/images\/(.*?)".*?>(.*)/;

export interface NewsFeed {
	name: string;
	feedUrl: string;
	items: FeedItem[];
}

export interface FeedItem {
	ts: string;
	title: string;
	link: string;
	origLink: string;
	description: string;
	img: string;
}

export class News extends Service {
	public readonly enabled = process.env.NEWS_ENABLED === '1';

	private parser: Parser<{}, { description: string }>;
	private feedMap: Map<string, NewsFeed> = new Map();

	private timer: NodeJS.Timer;

	public async init(): Promise<void> {
		if (!this.enabled) {
			this.log('NEWS DISABLED');
			return;
		}

		this.parser = new Parser({
			customFields: {
				item: ['description']
			}
		});

		await this.update();

		if (process.env.NEWS_UPDATE_INTERVAL) {
			const interval = 1000 * Number(process.env.NEWS_UPDATE_INTERVAL);
			this.timer = setInterval(this.update, interval);
			this.log('NEWS UPDATE STARTED', interval);
		} else {
			this.log('NEWS UPDATE DISABLED');
		}
	}

	public dispose(): void {
		clearInterval(this.timer);
	}

	private update = async () => {
		for (const feed of this.feedMap.values()) {
			await this.updateFeed(feed);
		}
	};

	private async updateFeed(newsFeed: NewsFeed) {
		const feed = await this.parser.parseURL(newsFeed.feedUrl);

		const items: FeedItem[] = [];
		const feedItems = feed.items.filter((item) => !item.description.includes('Hier finden Sie')).slice(0, 10);
		for (let i = 0; i < feedItems.length; i++) {
			const item = feedItems[i];
			const [, img, description] = MATCHER.exec(item.description);

			const date = parse(item.pubDate.substring(5), 'dd MMM yyyy HH:mm:ss x', new Date());

			items.push({
				ts: date.toISOString(),
				title: item.title,
				link: `/news/${newsFeed.name}/${i}`,
				origLink: item.link,
				description: description,
				img: `https://www.srf.ch/static/cms/images/${img}`
			});
		}

		newsFeed.items = items;
	}

	public async getItems(feedId: string) {
		let newsFeed = this.feedMap.get(feedId);
		if (!newsFeed) {
			this.log(`NEWS SETTING UP ${feedId}`);

			newsFeed = { name: feedId, feedUrl: `https://www.srf.ch/news/bnf/rss/${feedId}`, items: [] };
			this.feedMap.set(feedId, newsFeed);
			await this.updateFeed(newsFeed);
		}

		return newsFeed.items;
	}

	public async getArticle(feedId: string, itemId: number) {
		const { data } = await axios(this.feedMap.get(feedId).items[itemId].origLink);
		let page = data as string;

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

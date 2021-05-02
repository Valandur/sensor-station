import { parse } from 'date-fns';
import Parser from 'rss-parser';

import { Service } from './service';

const MATCHER = /<img src="https:\/\/www.srf.ch\/static\/cms\/images\/(.*?)".*?>(.*)/;

export interface FeedItem {
	date: Date;
	title: string;
	description: string;
	img: string;
}

export class News extends Service {
	private feedUrl: string;
	private parser: Parser<{}, { description: string }>;

	public items: FeedItem[] = [];
	private interval: NodeJS.Timer;

	public constructor(name: string, feedUrl: string) {
		super(`news/${name}`);

		this.feedUrl = feedUrl;
	}

	public async init(): Promise<void> {
		this.parser = new Parser({
			customFields: {
				item: ['description']
			}
		});

		await this.update();
		this.interval = setInterval(this.update, 10 * 60 * 1000);
	}

	public dispose(): void {
		clearInterval(this.interval);
	}

	private update = async () => {
		this.items = await this.getFeed(this.feedUrl);
	};

	private async getFeed(feedUrl: string) {
		const feed = await this.parser.parseURL(feedUrl);

		const items: FeedItem[] = [];
		const feedItems = feed.items.filter((item) => !item.description.includes('Hier finden Sie')).slice(0, 10);
		for (const item of feedItems) {
			const [, img, description] = MATCHER.exec(item.description);

			const imgPath = await this.cacheImage(`https://www.srf.ch/static/cms/images/${img}`);

			const date = parse(item.pubDate.substr(5), 'dd MMM yyyy HH:mm:ss x', new Date());

			items.push({
				date: date,
				title: item.title,
				description: description,
				img: imgPath
			});
		}

		return items;
	}
}

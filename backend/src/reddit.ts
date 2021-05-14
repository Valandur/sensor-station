import { parseISO } from 'date-fns';
import Parser from 'rss-parser';
import probe from 'probe-image-size';

import { Service } from './service';

// Check if we have an actual image link in the content
const MATCHER = /<a href="([\w:\/\.]*?\.(jpg|jpeg|png|bmp|webp))">\[link\]/i;

export interface FeedItem {
	date: Date;
	title: string;
	img: string;
	ratio: number;
}

export class Reddit extends Service {
	private feedUrl: string;
	private parser: Parser;

	public items: FeedItem[] = [];
	private interval: NodeJS.Timer;

	public constructor(feedUrl: string) {
		super();

		this.feedUrl = feedUrl;
	}

	public async init(): Promise<void> {
		this.parser = new Parser({
			customFields: {
				item: ['media:thumbnail']
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
		const feedItems = feed.items.filter((i) => !!i['media:thumbnail'] && MATCHER.test(i.content)).slice(0, 10);

		for (const item of feedItems) {
			const imgUrl = item['media:thumbnail']['$'].url;
			const imgInfo = await probe(imgUrl);
			const title = item.title
				.replace(/[[({]?oc[\])}]?/gi, '')
				.replace(/[[({]?(\d+\s*[x×]\s*\d+)[\])}]?/gi, '')
				.split(/[,-.]/)
				.map((s) => s.trim())
				.filter((s) => !!s)
				.join('\n');
			items.push({ date: parseISO(item.pubDate), title, img: imgUrl, ratio: imgInfo.width / imgInfo.height });
		}

		return items;
	}
}

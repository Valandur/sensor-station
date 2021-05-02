import { parseISO } from 'date-fns';
import { rm } from 'fs/promises';
import Parser from 'rss-parser';

import { Display } from './display';
import { Screen } from './screen';

const MATCHER = /<a href="([\w:\/\.]*?)">\[link\]/;

export interface FeedItem {
	date: Date;
	title: string;
	img: string;
}

export class Reddit extends Screen {
	private feedUrl: string;
	private parser: Parser;
	private interval: NodeJS.Timer;
	private items: FeedItem[] = [];
	private offset: number = 0;

	public constructor(name: string, feedUrl: string, display: Display) {
		super(name, display);

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

	public render(): void {
		super.render();

		const REDDIT_X = 15;
		const REDDIT_Y = 190;
		const REDDIT_SIZE = 40;
		const REDDIT_HEIGHT = this.display.HEIGHT - REDDIT_Y - 15;

		const item = this.items[this.offset];

		const [imgWidth] = this.context.drawImage(item.img, REDDIT_X, REDDIT_Y, null, REDDIT_HEIGHT);

		this.context.drawText(
			item.title,
			imgWidth + 2 * REDDIT_X,
			REDDIT_Y,
			this.display.WIDTH - imgWidth - 3 * REDDIT_X,
			this.display.HEIGHT - REDDIT_Y,
			REDDIT_SIZE,
			this.display.WHITE
		);
	}

	public onTap(): void {
		this.display.startScreenTimeout();

		this.offset++;
		if (this.offset >= this.items.length) {
			this.offset = 0;
		}
	}

	public onShow(): void {
		this.offset++;
		if (this.offset >= this.items.length) {
			this.offset = 0;
		}
	}

	private update = async () => {
		// await rm(this.dataDir, { force: true, recursive: true });
		this.items = await this.getFeed(this.feedUrl);
	};

	private async getFeed(feedUrl: string) {
		const feed = await this.parser.parseURL(feedUrl);

		const items: FeedItem[] = [];
		const feedItems = feed.items
			.filter((i) => {
				if (!i['media:thumbnail']) {
					return false;
				}
				const [, w, h] = i.title.match(/[[({]?(\d+)\s*[x×]\s*(\d+)[\])}]?/i);
				return Number(w) >= Number(h);
			})
			.slice(0, 10);

		for (const item of feedItems) {
			const [, imgUrl] = MATCHER.exec(item.content);
			const imgPath = await this.cacheImage(imgUrl, null, 512);
			const title = item.title
				.replace(/[[({]?oc[\])}]?/gi, '')
				.replace(/[[({]?(\d+\s*[x×]\s*\d+)[\])}]?/gi, '')
				.replace(/[(){}[\]]/gi, '')
				.split(/[,-]/)
				.map((s) => s.trim())
				.filter((s) => !!s)
				.join('\n');
			items.push({ date: parseISO(item.pubDate), title, img: imgPath });
		}

		return items;
	}
}

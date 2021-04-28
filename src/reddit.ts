import { rm } from 'fs/promises';
import Parser from 'rss-parser';

import { Display } from './display';
import { Screen } from './screen';

export class Reddit extends Screen {
	private feedUrl: string;
	private parser: Parser<{}, { 'media:thumbnail': { $: { url: string } } }>;
	private interval: NodeJS.Timer;
	private posts: string[] = [];
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

		const REDDIT_Y = 190;
		const REDDIT_HEIGHT = this.display.HEIGHT - REDDIT_Y - 15;

		this.context.drawImage(this.posts[this.offset], this.display.WIDTH / 2, REDDIT_Y, null, REDDIT_HEIGHT, 'x');
	}

	public onTap(): void {
		this.offset++;
		if (this.offset >= this.posts.length) {
			this.offset = 0;
		}
	}

	public onShow(): void {
		this.offset++;
		if (this.offset >= this.posts.length) {
			this.offset = 0;
		}
	}

	private update = async () => {
		await rm(this.dataDir, { force: true, recursive: true });
		this.posts = await this.getFeed(this.feedUrl);
	};

	private async getFeed(feedUrl: string) {
		const feed = await this.parser.parseURL(feedUrl);

		const items: string[] = [];
		const feedItems = feed.items.filter((i) => !!i['media:thumbnail']).slice(0, 10);
		for (const item of feedItems) {
			const url = item['media:thumbnail'].$.url;
			const imgPath = await this.cacheImage(url);
			items.push(imgPath);
		}

		return items;
	}
}

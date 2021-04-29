import { format, parse } from 'date-fns';
import { de } from 'date-fns/locale';
import { rm } from 'fs/promises';
import Parser from 'rss-parser';

import { Screen } from './screen';
import { Display } from './display';

const MATCHER = /<img src="https:\/\/www.srf.ch\/static\/cms\/images\/(.*?)".*?>(.*)/;

const NEWS_Y = 200;
const NEWS_X = 15;
const NEWS_TITLE_X = 230;
const NEWS_SIZE = 42;
const NEWS_DESC_SIZE = 34;
const NEWS_DESC_X = 200;
const NEWS_ITEMS = 2;
const NEWS_HEIGHT = 140;

export interface FeedItem {
	date: Date;
	title: string;
	description: string;
	img: string;
}

export class News extends Screen {
	private feedUrl: string;
	private id: string;
	private parser: Parser<{}, { description: string }>;
	private interval: NodeJS.Timer;
	private items: FeedItem[] = [];
	private item: FeedItem = null;
	private offset: number = 0;

	public constructor(name: string, feedUrl: string, display: Display) {
		super(name, display);

		this.feedUrl = feedUrl;
		this.id = this.feedUrl.substr(this.feedUrl.lastIndexOf('/'));
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

	public render(): void {
		super.render();

		if (this.item !== null) {
			this.context.drawText(
				this.item.title,
				NEWS_X,
				NEWS_Y,
				this.display.WIDTH - 2 * NEWS_X,
				NEWS_HEIGHT,
				NEWS_SIZE,
				this.display.BLUE
			);

			this.context.drawText(
				format(this.item.date, 'eee HH:mm', { locale: de }),
				NEWS_X,
				NEWS_Y + 2.5 * NEWS_SIZE,
				NEWS_SIZE,
				this.display.GRAY
			);

			this.context.drawText(
				this.item.description,
				NEWS_DESC_X,
				NEWS_Y + 2.5 * NEWS_SIZE,
				this.display.WIDTH - 2 * NEWS_X - NEWS_DESC_X,
				this.display.HEIGHT - 15 - NEWS_Y,
				NEWS_DESC_SIZE,
				this.display.WHITE
			);

			const width = NEWS_DESC_X - 2 * NEWS_X;
			this.context.drawImage(this.item.img, NEWS_X, NEWS_Y + 3.5 * NEWS_SIZE, width);
		} else {
			const items = this.items.slice(this.offset * NEWS_ITEMS, (this.offset + 1) * NEWS_ITEMS);

			for (let i = 0; i < items.length; i++) {
				const item = items[i];
				const y = NEWS_Y + i * NEWS_HEIGHT;

				const width = NEWS_TITLE_X - 2 * NEWS_X;
				this.context.drawImage(item.img, NEWS_X, y + 6, width);
				this.context.drawText(
					item.title,
					NEWS_TITLE_X,
					y,
					this.display.WIDTH - NEWS_X - NEWS_TITLE_X,
					NEWS_HEIGHT,
					NEWS_SIZE,
					this.display.WHITE
				);
			}
		}
	}

	public onTap({ x, y }: { x: number; y: number }): void {
		if (this.item !== null) {
			this.item = null;
			this.display.startScreenTimeout();
			return;
		}

		for (let i = 0; i < NEWS_ITEMS; i++) {
			if (
				x >= NEWS_X &&
				x <= NEWS_X + this.display.WIDTH - 2 * NEWS_X &&
				y >= NEWS_Y + i * NEWS_HEIGHT &&
				y < NEWS_Y + (i + 1) * NEWS_HEIGHT
			) {
				this.item = this.items[this.offset * NEWS_ITEMS + i];
				this.display.stopScreenTimeout();
				return;
			}
		}

		this.offset++;
		if (this.offset * NEWS_ITEMS >= this.items.length) {
			this.offset = 0;
		}
	}

	public onShow(): void {
		this.offset++;
		if (this.offset * NEWS_ITEMS >= this.items.length) {
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

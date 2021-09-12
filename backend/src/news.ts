import axios from 'axios';
import { parse } from 'date-fns';
import Parser from 'rss-parser';

import { Service } from './service';

const MATCHER = /<img src="https:\/\/www.srf.ch\/static\/cms\/images\/(.*?)".*?>(.*)/;

export interface FeedItem {
	date: Date;
	title: string;
	link: string;
	origLink: string;
	description: string;
	img: string;
}

export class News extends Service {
	private name: string;
	private feedUrl: string;
	private parser: Parser<{}, { description: string }>;

	public items: FeedItem[] = [];
	private interval: NodeJS.Timer;

	public constructor(name: string, feedUrl: string) {
		super();

		this.name = name;
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
		for (let i = 0; i < feedItems.length; i++) {
			const item = feedItems[i];
			const [, img, description] = MATCHER.exec(item.description);

			const date = parse(item.pubDate.substr(5), 'dd MMM yyyy HH:mm:ss x', new Date());

			items.push({
				date: date,
				title: item.title,
				link: `/news/${this.name}/${i}`,
				origLink: item.link,
				description: description,
				img: `https://www.srf.ch/static/cms/images/${img}`
			});
		}

		return items;
	}

	public async getArticle(id: number) {
		const { data } = await axios(this.items[id].origLink);
		let page = data as string;

		const headerStart = page.indexOf('<header');
		const mainStart = page.indexOf('<!-- Begin of main wrapper');
		page = page.substr(0, headerStart) + page.substr(mainStart);

		const mainEnd = page.indexOf('<!-- end of main wrapper-->');
		const scriptStart = page.indexOf('<span id="config__js"', mainEnd);
		page = page.substr(0, mainEnd) + page.substr(scriptStart);

		const headStart = page.indexOf('<head>') + 6;
		page = page.substr(0, headStart) + '<base href="https://www.srf.ch/">' + page.substr(headStart);

		page = page.replace('<div class="affix-placeholder affix-placeholder--compact js-affix-placeholder"></div>', '');

		return page;
	}
}

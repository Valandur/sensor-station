import { stat, rm } from 'fs/promises';
import Parser from 'rss-parser';
import Jimp from 'jimp';
import { parse } from 'date-fns';

const URL_GENERAL = 'https://www.srf.ch/news/bnf/rss/1646';
const URL_SPORT = 'https://www.srf.ch/sport/bnf/rss/718';
const MATCHER = /<img src="https:\/\/www.srf.ch\/static\/cms\/images\/(.*?)".*?>(.*)/;

export interface FeedItem {
	date: Date;
	title: string;
	description: string;
	img: string;
}

export class News {
	private parser: Parser<{}, { description: string }>;
	private interval: NodeJS.Timer;

	public general: FeedItem[] = [];
	public sport: FeedItem[] = [];

	public init() {
		this.parser = new Parser({
			customFields: {
				item: ['description']
			}
		});

		this.update();
		this.interval = setInterval(this.update, 10 * 60 * 1000);
	}

	public dispose() {
		clearInterval(this.interval);
	}

	private update = async () => {
		await rm('data/news', { force: true, recursive: true });

		this.general = await this.getFeed(URL_GENERAL);
		this.sport = await this.getFeed(URL_SPORT);
	};

	private async getFeed(feedUrl: string) {
		const feed = await this.parser.parseURL(feedUrl);

		const items: FeedItem[] = [];
		const feedItems = feed.items.filter((item) => !item.description.includes('Hier finden Sie')).slice(0, 10);
		for (const item of feedItems) {
			const [, img, description] = MATCHER.exec(item.description);

			const imgPath = await this.saveImg(img);

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

	private async saveImg(imgName: string) {
		const imgPath = `data/news/${imgName.replace(/\//g, '-').replace('.jpg', '.png')}`;

		const exists = await stat(imgPath)
			.then((s) => s.isFile())
			.catch(() => false);
		if (!exists) {
			const img = await Jimp.read(`https://www.srf.ch/static/cms/images/${imgName}`);
			await img.writeAsync(imgPath);
		}

		return imgPath;
	}
}

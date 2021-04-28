import { stat, rm } from 'fs/promises';
import Parser from 'rss-parser';
import Jimp from 'jimp';

const URL_AWW = 'https://www.reddit.com/r/aww/hot/.rss';

export class Reddit {
	private parser: Parser<{}, { 'media:thumbnail': { $: { url: string } } }>;
	private interval: NodeJS.Timer;

	public aww: string[] = [];

	public init() {
		this.parser = new Parser({
			customFields: {
				item: ['media:thumbnail']
			}
		});

		this.update();
		this.interval = setInterval(this.update, 10 * 60 * 1000);
	}

	public dispose() {
		clearInterval(this.interval);
	}

	private update = async () => {
		await rm('data/reddit', { force: true, recursive: true });

		this.aww = await this.getFeed(URL_AWW);
	};

	private async getFeed(feedUrl: string) {
		const feed = await this.parser.parseURL(feedUrl);

		const items: string[] = [];
		const feedItems = feed.items.filter((i) => !!i['media:thumbnail']).slice(0, 10);
		for (const item of feedItems) {
			const url = item['media:thumbnail'].$.url;
			const imgPath = await this.saveImg(url);
			items.push(imgPath);
		}

		return items;
	}

	private async saveImg(imgUrl: string) {
		let end = imgUrl.indexOf('?');
		if (end === -1) {
			end = imgUrl.length;
		}
		const imgPath = `data/reddit/${imgUrl.substring(imgUrl.lastIndexOf('/') + 1, end).replace('.jpg', '.png')}`;

		const exists = await stat(imgPath)
			.then((s) => s.isFile())
			.catch(() => false);
		if (!exists) {
			const img = await Jimp.read(imgUrl);
			await img.writeAsync(imgPath);
		}

		return imgPath;
	}
}

import express from 'express';
import cors from 'cors';

import { News } from './news';
import { Reddit } from './reddit';
import { Weather } from './weather';

const main = async () => {
	const app = express();

	app.use(cors());

	console.log('weather...');
	const weather = new Weather();
	await weather.init();
	app.get('/weather', (req, res) => {
		res.json({ forecasts: weather.forecasts, sensor: { temp: weather.sensorTemp, rh: weather.sensorRh } });
	});

	console.log('news...');
	const newsMap: Map<string, News> = new Map();
	app.get('/news/:id', async (req, res) => {
		const id = req.params.id;
		let news = newsMap.get(id);
		if (!news) {
			console.log(`setting up news ${id}`);
			news = new News(id, `https://www.srf.ch/news/bnf/rss/${id}`);
			newsMap.set(id, news);
			await news.init();
		}

		res.json(news.items);
	});
	app.get('/news/:id/:item', async (req, res) => {
		const id = req.params.id;
		let news = newsMap.get(id);
		if (!news) {
			console.log(`setting up news ${id}`);
			news = new News(id, `https://www.srf.ch/news/bnf/rss/${id}`);
			newsMap.set(id, news);
			await news.init();
		}

		const item = Number(req.params.item);
		const page = await news.getArticle(item);
		res.send(page);
	});

	console.log('reddit...');
	const redditMap: Map<string, Reddit> = new Map();
	app.get('/reddit/:name', async (req, res) => {
		const name = req.params.name;
		let reddit = redditMap.get(name);
		if (!reddit) {
			console.log(`setting up reddit ${name}`);
			reddit = new Reddit(`https://www.reddit.com/r/${name}/hot/.rss`);
			redditMap.set(name, reddit);
			await reddit.init();
		}

		res.json(reddit.items);
	});

	console.log('running...');
	app.listen(2000);
};

main().catch((err) => console.error(err));

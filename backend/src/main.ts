import express from 'express';
import cors from 'cors';
import { json } from 'body-parser';

import { News } from './news';
import { Weather } from './weather';
import { PiJuice } from './pijuice';

const main = async () => {
	const app = express();

	app.use(cors());
	app.use(json());
	app.use(express.static(`../frontend/build`));

	console.log('pijuice...');
	const pijuice = new PiJuice();
	await pijuice.init();
	app.get('/battery', (req, res) => {
		res.json({ status: pijuice.status, battery: pijuice.battery });
	});

	console.log('weather...');
	const weather = new Weather();
	await weather.init();
	app.get('/weather', (req, res) => {
		res.json({ forecasts: weather.forecasts });
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

	await new Promise<void>((resolve) => app.listen(3000, '0.0.0.0', resolve));
	console.log('running...');
};

main().catch((err) => console.error(err));

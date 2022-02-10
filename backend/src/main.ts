import express, { RequestHandler } from 'express';
import cors from 'cors';
import fileUpload, { UploadedFile } from 'express-fileupload';
import { json, urlencoded } from 'body-parser';

import './types';

import { Modem } from './modem';
import { News } from './news';
import { Battery } from './battery';
import { Reddit } from './reddit';
import { Upload } from './upload';
import { Weather } from './weather';
import { isNight } from './util';

const main = async () => {
	const app = express();

	app.use(cors());
	app.use(json() as RequestHandler);
	app.use(express.static(`../frontend/build`));

	if (!process.env.DISABLE_UPLOAD) {
		app.use('/web', express.static(`../frontend/build`));
		app.use(urlencoded({ extended: true }) as RequestHandler);
		app.use(fileUpload({ createParentPath: true }));
	}

	// Weather
	console.log('weather...');
	const weather = new Weather();
	if (!process.env.DISABLE_WEATHER) {
		await weather.init();
	} else {
		console.log('WEATHER DISABLED');
	}

	// Battery
	console.log('battery...');
	const battery = new Battery();
	if (!process.env.DISABLE_BATTERY) {
		await battery.init();
	} else {
		console.log('BATTERY DISABLED');
	}

	// Modem
	console.log('modem...');
	const modem = new Modem();
	if (!process.env.DISABLE_MODEM) {
		await modem.init();
	} else {
		console.log('MODEM DISABLED');
	}

	// General data route
	app.get('/data', (req, res) => {
		const now = new Date();

		res.json({
			date: now,
			isNight: isNight(now),
			weather: weather.status,
			battery: battery.status,
			modem: modem.status
		});
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

	if (!process.env.DISABLE_REDDIT) {
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
	} else {
		console.log('REDDIT DISABLED');
	}

	if (!process.env.DISABLE_UPLOAD) {
		console.log('upload...');
		const upload = new Upload();
		await upload.init();

		app.use(express.static(`data`));
		app.get('/upload', async (req, res) => {
			res.json(upload.items);
		});
		app.post('/upload', async (req, res) => {
			if (!req.files) {
				return res.status(400).json({ error: 'No file uploaded' }).end();
			}

			const img = req.files.image as UploadedFile;
			const descr = req.body.description;

			await upload.save(img, descr);

			res.json(upload.items);
		});
		app.delete('/upload', async (req, res) => {
			await upload.remove(req.body.img);

			res.json(upload.items);
		});
	} else {
		console.log('UPLOAD DISABLED');
	}

	const port = process.env.PORT ? Number(process.env.PORT) : 80;

	await new Promise<void>((resolve) => app.listen(port || 80, '0.0.0.0', resolve));
	console.log(`running on 0.0.0.0:${port}...`);
};

main().catch((err) => console.error(err));

import express, { RequestHandler } from 'express';
import cors from 'cors';
import fileUpload, { UploadedFile } from 'express-fileupload';
import { json, urlencoded } from 'body-parser';

import { News } from './news';
import { Reddit } from './reddit';
import { Weather } from './weather';
import { Upload } from './upload';
import { PiJuice } from './pijuice';

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

	if (!process.env.DISABLE_PIJUICE) {
		console.log('pijuice...');
		const pijuice = new PiJuice();
		await pijuice.init();
		app.get('/pijuice', (req, res) => {
			res.json({ status: pijuice.status, battery: pijuice.battery });
		});
	}

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
	}

	await new Promise<void>((resolve) => app.listen(80, '0.0.0.0', resolve));
	console.log('running...');
};

main().catch((err) => console.error(err));

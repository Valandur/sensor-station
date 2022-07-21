import express from 'express';
import cors from 'cors';
import fileUpload, { UploadedFile } from 'express-fileupload';
import { json, urlencoded } from 'body-parser';

import 'dotenv/config';
import './types';

import { Modem } from './modem';
import { News } from './news';
import { Battery } from './battery';
import { Upload } from './upload';
import { Weather } from './weather';
import { isValid, parseISO } from 'date-fns';

const main = async () => {
	const app = express();

	app.use(cors());
	app.use(json());
	app.use(express.static(`../frontend/build`));

	app.options('*', cors());

	if (!process.env.DISABLE_UPLOAD) {
		app.use('/web', express.static(`../frontend/build`));
		app.use(urlencoded({ extended: true }));
		app.use(fileUpload({ createParentPath: true }));
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
		res.json({
			battery: battery.status,
			modem: modem.status,
			interfaces: modem.interfaces
		});
	});

	// Weather
	console.log('weather...');
	const weather = new Weather();
	await weather.init();
	app.get('/weather', (req, res) => {
		res.json(weather.status);
	});

	console.log('news...');
	const newsMap: Map<string, News> = new Map();
	app.get('/news/:id', async (req, res) => {
		try {
			const id = req.params.id;
			let news = newsMap.get(id);
			if (!news) {
				console.log(`setting up news ${id}`);
				news = new News(id, `https://www.srf.ch/news/bnf/rss/${id}`);
				newsMap.set(id, news);
				await news.init();
			}

			res.json(news.items);
		} catch (err) {
			console.error(err);
			res.status(500).send(err.message);
		}
	});
	app.get('/news/:id/:item', async (req, res) => {
		try {
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
		} catch (err) {
			console.error(err);
			res.status(500).send(err.message);
		}
	});

	if (!process.env.DISABLE_UPLOAD) {
		console.log('upload...');
		const upload = new Upload();
		await upload.init();

		app.use(express.static(`data`));
		app.get('/upload', async (req, res) => {
			res.json(upload.items);
		});
		app.post('/upload', async (req, res) => {
			try {
				if (!req.files) {
					return res.status(400).json({ error: 'No file uploaded' }).end();
				}

				const img = req.files.image as UploadedFile;
				const title = req.body.title;
				let date = parseISO(req.body.date);
				if (!isValid(date)) {
					date = new Date();
				}

				await upload.save(img, title, date);

				res.json(upload.items);
			} catch (err) {
				console.error(err);
				res.status(500).send(err.message);
			}
		});
		app.put('/upload', async (req, res) => {
			try {
				const img = req.body.img;
				const title = req.body.title;
				const date = parseISO(req.body.date);

				await upload.edit(img, title, date);

				res.json(upload.items);
			} catch (err) {
				console.error(err);
				res.status(500).send(err.message);
			}
		});
		app.delete('/upload', async (req, res) => {
			try {
				await upload.remove(req.body.img);

				res.json(upload.items);
			} catch (err) {
				console.error(err);
				res.status(500).send(err.message);
			}
		});
	} else {
		console.log('UPLOAD DISABLED');
	}

	const port = process.env.PORT ? Number(process.env.PORT) : 80;

	await new Promise<void>((resolve) => app.listen(port || 80, '0.0.0.0', resolve));
	console.log(`running on 0.0.0.0:${port}...`);
};

main().catch((err) => console.error(err));

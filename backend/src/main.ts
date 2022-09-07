import express, { Application } from 'express';
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
import { format, isValid, parseISO } from 'date-fns';
import { appendFile, mkdir, stat, writeFile } from 'fs/promises';

const main = async () => {
	let app: Application | null = null;

	if (!process.env.DISABLE_SERVER) {
		app = express();

		app.use(cors());
		app.use(json());
		app.use(express.static(`../frontend/build`));

		app.options('*', cors());

		if (!process.env.DISABLE_UPLOAD) {
			console.log('upload...');
			const upload = new Upload();
			await upload.init();

			app.use('/web', express.static(`../frontend/build`));
			app.use(urlencoded({ extended: true }));
			app.use(fileUpload({ createParentPath: true }));

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
	} else {
		console.log('SERVER DISABLED');
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

	if (app) {
		// General data route
		app.get('/data', (req, res) => {
			res.json({
				battery: battery.status,
				modem: modem.status,
				interfaces: modem.interfaces
			});
		});
	}

	// Weather
	console.log('weather...');
	const weather = new Weather();
	await weather.init();

	if (process.env.RECORDING_INTERVAL) {
		await mkdir('./data/recordings/', { recursive: true });

		const record = async () => {
			try {
				await weather.update();
				const { temp, rh } = weather.status;
				const date = new Date();
				const fileName = `./data/recordings/${format(date, 'yyyy_MM')}.txt`;

				if (!(await stat(fileName).catch(() => false))) {
					await writeFile(fileName, `${date.toISOString()},${temp},${rh}\n`, 'utf-8');
				} else {
					await appendFile(fileName, `${date.toISOString()},${temp},${rh}\n`, 'utf-8');
				}

				console.log(`Recorded temp & rh`, date, temp, rh);
			} catch (err) {
				console.error(err);
			}
		};

		await record();
		setInterval(record, 1000 * Number(process.env.RECORDING_INTERVAL));
	}

	if (app) {
		app.get('/weather', (req, res) => {
			res.json(weather.status);
		});
	}

	console.log('news...');
	const newsMap: Map<string, News> = new Map();

	if (app) {
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
	}

	if (app) {
		const port = process.env.PORT ? Number(process.env.PORT) : 80;

		await new Promise<void>((resolve) => app.listen(port || 80, '0.0.0.0', resolve));
		console.log(`running on 0.0.0.0:${port}...`);
	}
};

main().catch((err) => console.error(err));

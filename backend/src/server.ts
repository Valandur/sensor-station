import express, { Application } from 'express';
import cors from 'cors';
import { isValid, parseISO } from 'date-fns';
import fileUpload, { UploadedFile } from 'express-fileupload';
import imageSize from 'image-size';
import { extname } from 'path';
import { json, urlencoded } from 'body-parser';
import { readFile, rm, writeFile } from 'fs/promises';

import { Service } from './service';
import { createReadStream } from 'fs';

const ITEMS_PATH = `data/upload/items.json`;

export type RegisterCallback = (app: Application) => Promise<void> | void;

export interface UploadItem {
	title: string;
	date: Date;
	img: string;
	ratio: number;
}

export class Server extends Service {
	public readonly enabled = !process.env.SERVER_DISABLED;
	public readonly uploadEnabled = !process.env.SERVER_UPLOAD_DISABLED;

	private cbs: RegisterCallback[] = [];
	private items: UploadItem[] = [];

	public webApp: Application;

	public override async init(): Promise<void> {
		if (!this.enabled) {
			console.log('SERVER DISABLED');
			return;
		}

		this.webApp = express();
		this.webApp.use(cors());
		this.webApp.use(json());
		this.webApp.use(express.static(`../frontend/build`));

		this.webApp.options('*', cors());

		// General data route
		this.webApp.get('/data', (req, res) => {
			res.json({
				battery: this.app.battery.status,
				modem: this.app.modem.status,
				interfaces: this.app.modem.interfaces
			});
		});

		// News
		this.webApp.get('/news/:id', async (req, res) => {
			try {
				const id = req.params.id;
				const items = await this.app.news.getItems(id);
				res.json(items);
			} catch (err) {
				console.error(err);
				res.status(500).send(err.message);
			}
		});
		this.webApp.get('/news/:id/:item', async (req, res) => {
			try {
				const id = req.params.id;
				const item = Number(req.params.item);
				const page = await this.app.news.getArticle(id, item);
				res.send(page);
			} catch (err) {
				console.error(err);
				res.status(500).send(err.message);
			}
		});

		// Weather
		this.webApp.get('/weather', (req, res) => {
			res.json({
				forecasts: this.app.weather.forecasts,
				alerts: this.app.weather.alerts,
				temp: this.app.sensor.temperature,
				rh: this.app.sensor.relativeHumidity
			});
		});

		// Recordings
		this.webApp.get('/recordings/:year/:month', (req, res) => {
			try {
				const year = req.params.year;
				const month = req.params.month;
				res.setHeader('content-type', 'text/csv');
				res.setHeader('content-disposition', `attachment;filename=recordings_${year}_${month}.csv`);
				this.app.sensor.createReadStream(year, month).pipe(res);
			} catch (err) {
				console.error(err);
				res.status(500).send(err.message);
			}
		});

		if (!this.uploadEnabled) {
			console.log('SERVER UPLOAD DISABLED');
			return;
		}

		this.webApp.use('/web', express.static(`../frontend/build`));
		this.webApp.use(urlencoded({ extended: true }));
		this.webApp.use(fileUpload({ createParentPath: true }));

		// TODO: Only expose uploads folder
		this.webApp.use(express.static(`data`));

		const itemsJson = JSON.parse(await readFile(ITEMS_PATH, 'utf-8').catch(() => '[]'));
		this.items = itemsJson.map((item: any) => ({
			title: item.title,
			date: item.date ? parseISO(item.date) : new Date(),
			img: item.img.startsWith('/') ? item.img : '/' + item.img,
			ratio: item.ratio
		}));
		console.log(`Loaded ${this.items.length} uploaded images`);

		this.webApp.get('/upload', async (req, res) => {
			res.json(this.items);
		});
		this.webApp.post('/upload', async (req, res) => {
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

				await this.save(img, title, date);

				res.json(this.items);
			} catch (err) {
				console.error(err);
				res.status(500).send(err.message);
			}
		});
		this.webApp.put('/upload', async (req, res) => {
			try {
				const img = req.body.img;
				const title = req.body.title;
				const date = parseISO(req.body.date);

				await this.edit(img, title, date);

				res.json(this.items);
			} catch (err) {
				console.error(err);
				res.status(500).send(err.message);
			}
		});
		this.webApp.delete('/upload', async (req, res) => {
			try {
				await this.remove(req.body.img);

				res.json(this.items);
			} catch (err) {
				console.error(err);
				res.status(500).send(err.message);
			}
		});
	}

	public async register(cb: RegisterCallback) {
		this.cbs.push(cb);
	}

	public async run() {
		if (!this.enabled) {
			this.cbs = [];
			return;
		}

		for (const cb of this.cbs) {
			await cb(this.webApp);
		}
		this.cbs = [];

		const port = (process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 80) || 80;
		await new Promise<void>((resolve) => this.webApp.listen(port, '0.0.0.0', resolve));
		console.log(`SERVER RUNNING ON 0.0.0.0:${port}...`);
	}

	public async save(image: UploadedFile, title: string, date: Date) {
		const path = `/upload/${image.md5}${extname(image.name)}`;
		image.mv(`data/${path}`);

		const size = imageSize(image.data);
		const ratio = size.orientation >= 5 ? size.height / size.width : size.width / size.height; // If the image is rotated 90° switch the ratio

		this.items.push({ img: path, title, date, ratio });
		await writeFile(ITEMS_PATH, JSON.stringify(this.items), 'utf-8');
	}

	public async edit(img: string, title: string, date: Date) {
		const idx = this.items.findIndex((i) => i.img === img);
		if (idx < 0) {
			throw new Error(`Removing invalid image`);
		}

		this.items = this.items.map((item, i) => (i !== idx ? item : { ...item, title, date }));
		await writeFile(ITEMS_PATH, JSON.stringify(this.items), 'utf-8');
	}

	public async remove(img: string) {
		const idx = this.items.findIndex((i) => i.img === img);
		if (idx < 0) {
			throw new Error(`Removing invalid image`);
		}

		await rm(`data/${img}`);
		this.items.splice(idx, 1);

		await writeFile(ITEMS_PATH, JSON.stringify(this.items), 'utf-8');
	}
}

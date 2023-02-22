import { parseISO } from 'date-fns';
import { readFile, rm, writeFile } from 'fs/promises';
import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import mercurius, { IResolvers } from 'mercurius';

import { Service } from '../service';

const ITEMS_PATH = `data/upload/items.json`;

export interface UploadItem {
	title: string;
	date: Date;
	img: string;
	ratio: number;
}

export class Server extends Service {
	public readonly enabled = process.env.SERVER_ENABLED === '1';
	public readonly uploadEnabled = process.env.SERVER_UPLOAD_ENABLED === '1';

	private items: UploadItem[] = [];

	public webApp: FastifyInstance;

	public override async init(): Promise<void> {
		if (!this.enabled) {
			console.log('SERVER DISABLED');
			return;
		}

		this.webApp = Fastify();

		await this.webApp.register(cors, {
			origin: true,
			credentials: true
		});

		const schema = `
			type Query {
				battery: BatteryStatusInfo
				modem: ModemStatusInfo
				interfaces: [Interface!]
				weather: WeatherInfo
				news(feed: String!): [NewsItem!]
				recordings: [Recording!]!
			}

			type BatteryStatusInfo {
				isFault: Boolean!
				isButton: Boolean!
				batteryStatus: String!
				powerIn: String!
				powerIn5vIo: String!
				charge: Float!
				voltage: Float!
				current: Float!
			}

			type ModemStatusInfo {
				isConnected: Boolean!
				time: String!
				tzOffset: String!
				operator: String!
				signal: Float!
				lat: Float!
				lng: Float!
				tzName: String!
				cached: Boolean!
			}

			type Interface {
				name: String!
				ips: [String!]!
			}

			type WeatherInfo {
				forecasts: [WeatherForecast!]!
				alerts: [WeatherAlert!]!
				temp: Float!
				rh: Float!
			}

			type WeatherForecast {
				ts: String!
				img: String!
				feelsLike: Float!
			}

			type WeatherAlert {
				sender: String!
				event: String!
				start: String!
				end: String!
				description: String!
				tags: [String!]!
			}

			type NewsItem {
				ts: String!
				title: String!
				link: String!
				origLink: String!
				description: String!
				img: String!
			}

			type Recording {
				ts: String!
				temp: Float!
				rh: Float!
			}
		`;

		const resolvers: IResolvers = {
			Query: {
				battery: () => this.app.battery.status,
				modem: () => this.app.modem.status,
				interfaces: () => this.app.modem.interfaces,
				weather: () => ({
					forecasts: this.app.weather.forecasts,
					alerts: this.app.weather.alerts,
					temp: this.app.sensor.temperature,
					rh: this.app.sensor.relativeHumidity
				}),
				news: (_, { feed }) => this.app.news.getItems(feed),
				recordings: () => this.app.sensor.getRecordings()
			}
		};

		this.webApp.register(mercurius, { schema, resolvers, graphiql: true });

		this.webApp.get('/news/:id/:item', async (req, res) => {
			try {
				const id = (req.params as any).id;
				const item = Number((req.params as any).item);
				const page = await this.app.news.getArticle(id, item);
				res.type('text/html');
				res.send(page);
			} catch (err) {
				console.error(err);
				res.status(500).send(err.message);
			}
		});

		/*
		if (!this.uploadEnabled) {
			console.log('SERVER UPLOAD DISABLED');
			return;
		}

		this.webApp.use('/web', express.static(`../frontend/build`));
		this.webApp.use(urlencoded({ extended: true }));
		this.webApp.use(fileUpload({ createParentPath: true }));

		// TODO: Only expose uploads folder
		this.webApp.use(express.static(`data`));
		*/

		const itemsJson = JSON.parse(await readFile(ITEMS_PATH, 'utf-8').catch(() => '[]'));
		this.items = itemsJson.map((item: any) => ({
			title: item.title,
			date: item.date ? parseISO(item.date) : new Date(),
			img: item.img.startsWith('/') ? item.img : '/' + item.img,
			ratio: item.ratio
		}));
		console.log(`Loaded ${this.items.length} uploaded images`);

		/*
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
		*/
	}

	public async run() {
		const port = (process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 80) || 80;
		const addr = await this.webApp.listen({ port, host: '0.0.0.0' });
		console.log(`SERVER RUNNING ON ${addr}...`);
	}

	/*
	public async save(image: UploadedFile, title: string, date: Date) {
		const path = `/upload/${image.md5}${extname(image.name)}`;
		image.mv(`data/${path}`);

		const size = imageSize(image.data);
		const ratio = size.orientation >= 5 ? size.height / size.width : size.width / size.height; // If the image is rotated 90° switch the ratio

		this.items.push({ img: path, title, date, ratio });
		await writeFile(ITEMS_PATH, JSON.stringify(this.items), 'utf-8');
	}*/

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

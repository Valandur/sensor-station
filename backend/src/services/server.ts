import { isThisSecond, isValid, parseISO } from 'date-fns';
import { readFile, rm, writeFile } from 'fs/promises';
import Fastify, { FastifyInstance } from 'fastify';
import FastifyStatic from '@fastify/static';
import FastifyFileUpload from 'fastify-file-upload';
import cors from '@fastify/cors';
import mercurius, { IResolvers } from 'mercurius';
import { extname, join, resolve } from 'path';
import imageSize from 'image-size';

import { Service } from './service';

export interface File {
	name: string;
	mimetype: string;
	data: Buffer;
	md5: string;
	mv: (path: string) => void;
}

export interface UploadItem {
	ts: string;
	title: string;
	img: string;
	ratio: number;
}

declare module 'http' {
	interface IncomingMessage {
		files: File[];
	}
}

export class Server extends Service {
	public readonly enabled = process.env.SERVER_ENABLED === '1';
	public readonly uploadEnabled = process.env.SERVER_UPLOAD_ENABLED === '1';

	private items: UploadItem[] = [];

	public webApp: FastifyInstance;

	public override async init(): Promise<void> {
		if (!this.enabled) {
			this.log('SERVER DISABLED');
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
				recordings: [Recording!]
				uploads: [Upload!]
				events: [CalendarEvent!]
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

			type Upload {
				ts: String!
				title: String!
				img: String!
				ratio: Float!
			}

			type CalendarEvent {
				ts: String!
				repeats: String!
				description: String!
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
				recordings: () => this.app.sensor.getRecordings(),
				uploads: () => this.items,
				events: () => this.app.calendar.events
			}
		};

		this.webApp.register(mercurius, { schema, resolvers, graphiql: true });

		this.webApp.get('/news/:id/:item', async (req, res) => {
			const id = (req.params as any).id;
			const item = Number((req.params as any).item);
			const page = await this.app.news.getArticle(id, item);
			res.type('text/html');
			res.send(page);
		});

		this.webApp.register(FastifyStatic, {
			root: resolve('..', 'frontend2')
		});

		// Exit here if we don't need any of the upload stuff
		if (!this.uploadEnabled) {
			this.log('SERVER UPLOAD DISABLED');
			return;
		}

		this.webApp.register(FastifyFileUpload);

		this.webApp.register(FastifyStatic, {
			root: resolve('data', 'upload'),
			prefix: '/upload',
			decorateReply: false
		});

		await this.app.storage.run('CREATE TABLE IF NOT EXISTS uploads (ts DATETIME, title TEXT, img TEXT, ratio DOUBLE)');
		this.items = await this.app.storage.all('SELECT * FROM uploads');
		this.log(`Loaded ${this.items.length} uploaded images`);

		this.webApp.post<{ Body: { title: string; ts: string } }>('/upload', async (req, res) => {
			const files = req.raw.files;
			if (!files) {
				res.status(400);
				res.send({ error: 'No file uploaded' });
				return;
			}

			this.log(files);

			const file = files[0];
			const title = req.body.title;
			const ts = req.body.ts;

			const path = `/upload/${file.md5}${extname(file.name)}`;
			file.mv(`data/${path}`);

			const size = imageSize(file.data);
			const ratio = size.orientation >= 5 ? size.height / size.width : size.width / size.height; // If the image is rotated 90° switch the ratio

			this.items.push({ ts, title, img: path, ratio });
			await this.app.storage.run('INSERT INTO uploads (ts, title, img, ratio) VALUES (?, ?, ?, ?)', [
				ts,
				title,
				path,
				ratio
			]);

			res.status(201).send();
		});
		this.webApp.put<{ Body: { img: string; title: string; ts: string } }>('/upload', async (req, res) => {
			const ts = req.body.ts;
			const title = req.body.title;
			const img = req.body.img;

			const idx = this.items.findIndex((i) => i.img === img);
			if (idx < 0) {
				throw new Error(`Image not found`);
			}

			this.items = this.items.map((item, i) => (i !== idx ? item : { ...item, ts, title }));
			await this.app.storage.run('UPDATE uploads SET ts = ?, title = ? WHERE img = ?', [ts, title, img]);

			res.status(200).send();
		});
		this.webApp.delete<{ Body: { img: string } }>('/upload', async (req, res) => {
			const img = req.body.img;

			const idx = this.items.findIndex((i) => i.img === img);
			if (idx < 0) {
				throw new Error(`Image not found`);
			}

			await rm(`data/${img}`);
			this.items.splice(idx, 1);
			await this.app.storage.run('DELETE FROM uploads WHERE img = ?', [img]);

			res.status(200).send();
		});
	}

	public override async start() {
		const port = (process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 80) || 80;
		const addr = await this.webApp.listen({ port, host: '0.0.0.0' });
		this.log(`SERVER RUNNING ON ${addr}...`);
	}
}

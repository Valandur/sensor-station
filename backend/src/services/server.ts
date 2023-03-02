import { rm } from 'fs/promises';
import Fastify, { FastifyInstance } from 'fastify';
import FastifyStatic from '@fastify/static';
import FastifyFileUpload from 'fastify-file-upload';
import cors from '@fastify/cors';
import mercurius, { IResolvers } from 'mercurius';
import { extname, resolve } from 'path';
import imageSize from 'image-size';

import { Service } from './service';
import { GQL_SCHEMA } from './server-gql';

export interface File {
	name: string;
	mimetype: string;
	data: Buffer;
	md5: string;
	mv: (path: string) => void;
}

export interface UploadItem {
	id: number;
	ts: string;
	title: string;
	img: string;
	ratio: number;
}

export interface Screen {
	id: number;
	name: string;
	params: string;
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
	private screens: Screen[] = [];

	public webApp: FastifyInstance;

	public override async init(): Promise<void> {
		if (!this.enabled) {
			this.log('SERVER DISABLED');
			return;
		}

		await this.app.storage.run(
			'CREATE TABLE IF NOT EXISTS screens (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, params TEXT)'
		);
		this.screens = await this.app.storage.all('SELECT * FROM screens');
		this.log(`Loaded ${this.screens.length} screens`);

		this.webApp = Fastify();

		await this.webApp.register(cors, {
			origin: true,
			credentials: true
		});

		const resolvers: IResolvers = {
			Query: {
				battery: () => this.app.battery.status,
				modem: () => this.app.modem.status,
				interfaces: () => this.app.modem.interfaces,
				forecasts: () => this.app.weather.forecasts,
				alerts: () => this.app.weather.alerts,
				sensors: () => this.app.sensor.newest,
				news: (_, { feed }) => this.app.news.getItems(feed),
				recordings: () => this.app.sensor.getRecordings(),
				uploads: () => this.items,
				events: () => this.app.calendar.events,
				screens: () => this.screens
			},
			Mutation: {
				saveScreens: async (_, { screens }: { screens: Screen[] }) => {
					await this.app.storage.run('DELETE FROM screens');

					await this.app.storage.runPrepared(
						'INSERT INTO screens (id, name, params) VALUES (?, ?, ?) ON CONFLICT (id) DO UPDATE SET name = excluded.name, params = excluded.params',
						screens.map((screen) => [screen.id, screen.name, screen.params])
					);

					this.screens = await this.app.storage.all('SELECT * FROM screens');

					return this.screens;
				}
			}
		};

		this.webApp.register(mercurius, { schema: GQL_SCHEMA, resolvers, graphiql: true });

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

		await this.app.storage.run(
			'CREATE TABLE IF NOT EXISTS uploads (id INTEGER PRIMARY KEY AUTOINCREMENT, ts DATETIME, title TEXT, img TEXT, ratio DOUBLE)'
		);
		this.items = await this.app.storage.all('SELECT * FROM uploads');
		this.log(`Loaded ${this.items.length} uploaded images`);

		this.webApp.post<{ Body: { title: string; ts: string } }>('/upload', async (req, res) => {
			const files = req.raw.files;
			if (!files) {
				res.status(400);
				res.send({ error: 'No file uploaded' });
				return;
			}

			const file = files[0];
			const title = req.body.title;
			const ts = req.body.ts;

			const path = `/upload/${file.md5}${extname(file.name)}`;
			file.mv(`data/${path}`);

			const size = imageSize(file.data);
			const ratio = size.orientation >= 5 ? size.height / size.width : size.width / size.height; // If the image is rotated 90° switch the ratio

			const id = await this.app.storage.run('INSERT INTO uploads (ts, title, img, ratio) VALUES (?, ?, ?, ?)', [
				ts,
				title,
				path,
				ratio
			]);
			this.items.push({ id, ts, title, img: path, ratio });

			res.status(201).send();
		});
		this.webApp.put<{ Params: { id: number }; Body: { img: string; title: string; ts: string } }>(
			'/upload/:id',
			async (req, res) => {
				const id = req.params.id;
				const ts = req.body.ts;
				const title = req.body.title;
				const img = req.body.img;

				this.items = this.items.map((item) => (item.id !== id ? item : { ...item, ts, title, img }));
				await this.app.storage.run('UPDATE uploads SET ts = ?, title = ?, img = ? WHERE id = ?', [ts, title, img, id]);

				res.status(200).send();
			}
		);
		this.webApp.delete<{ Params: { id: number } }>('/upload/:id', async (req, res) => {
			const id = req.params.id;

			const item = this.items.find((item) => item.id === id);
			if (!item) {
				throw new Error(`Image not found`);
			}

			await rm(`data/${item.img}`);
			this.items = this.items.filter((item) => item.id !== id);
			await this.app.storage.run('DELETE FROM uploads WHERE id = ?', [item.id]);

			res.status(200).send();
		});
	}

	public override async start() {
		const port = (process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 80) || 80;
		const addr = await this.webApp.listen({ port, host: '0.0.0.0' });
		this.log(`SERVER RUNNING ON ${addr}...`);
	}
}

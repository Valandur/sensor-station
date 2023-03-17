import { rm } from 'fs/promises';
import Fastify, { FastifyInstance } from 'fastify';
import FastifyStatic from '@fastify/static';
import FastifyFileUpload from 'fastify-file-upload';
import cors from '@fastify/cors';
import mercurius, { IResolverObject, IResolvers } from 'mercurius';
import { extname, resolve } from 'path';
import imageSize from 'image-size';
import { exec } from 'child_process';

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
	sort: number;
	params: string;
}

declare module 'http' {
	interface IncomingMessage {
		files: File[];
	}
}

export class Server extends Service {
	public readonly uploads = process.env['SERVER_UPLOAD_ENABLED'] === '1';

	private screens: Screen[] = [];
	private items: UploadItem[] | null = null;

	private webApp: FastifyInstance | null = null;

	protected override async doInit(): Promise<void> {
		await this.app.storage.run(
			'CREATE TABLE IF NOT EXISTS screens (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, sort INTEGER, params TEXT)'
		);
		await this.app.storage.run(
			'CREATE TABLE IF NOT EXISTS uploads (id INTEGER PRIMARY KEY AUTOINCREMENT, ts DATETIME, title TEXT, img TEXT, ratio DOUBLE)'
		);

		this.webApp = Fastify({ maxParamLength: 255 });
		await this.webApp.register(cors, { origin: true, credentials: true });

		const resolvers: IResolvers = {
			Query: {
				battery: () => ({
					status: () => this.app.battery.status
				}),
				calendar: () => ({
					events: () => this.app.calendar.events
				}),
				games: () => ({
					freeEpic: () => this.app.games.freeEpic
				}),
				modem: () => ({
					status: () => this.app.modem.status
				}),
				network: () => ({
					interfaces: () => this.app.modem.interfaces
				}),
				news: (): IResolverObject => ({
					items: ({ feed }) => this.app.news.getItems(feed)
				}),
				sbb: () => ({
					alerts: () => this.app.sbb.alerts
				}),
				screens: () => this.screens,
				sensors: () => ({
					newest: () => this.app.sensor.newest,
					recordings: () => this.app.sensor.getRecordings()
				}),
				uploads: () => ({
					items: () => this.items
				}),
				weather: () => ({
					hourly: () => this.app.weather.hourly,
					daily: () => this.app.weather.daily,
					alerts: () => this.app.weather.alerts
				})
			},
			Mutation: {
				saveScreens: async (_, { screens }: { screens: Screen[] }) => {
					await this.app.storage.run('DELETE FROM screens');

					await this.app.storage.runPrepared(
						'INSERT INTO screens (id, name, sort, params) ' +
							'VALUES (?, ?, ?, ?) ON CONFLICT (id) DO UPDATE SET name = excluded.name, sort = excluded.sort, params = excluded.params',
						screens.map((screen, i) => [screen.id, screen.name, i + 1, screen.params])
					);

					this.screens = await this.app.storage.all('SELECT * FROM screens ORDER BY sort');

					return this.screens;
				},
				restart: async () => {
					exec('sudo /sbin/shutdown -r now', (msg) => this.log(msg));
					return true;
				}
			}
		};
		await this.webApp.register(mercurius, { schema: GQL_SCHEMA, resolvers, graphiql: true });

		await this.webApp.register(FastifyStatic, { root: resolve('..', 'frontend', 'build') });

		this.webApp.get<{ Params: { id: string; item: string } }>('/news/:id/:item', async (req, res) => {
			const page = await this.app.news.getArticle(req.params.id, req.params.item);
			res.type('text/html');
			res.send(page);
		});

		// Exit here if we don't need any of the upload stuff
		if (!this.uploads) {
			this.log('UPLOADS DISABLED');
			return;
		}

		await this.webApp.register(FastifyFileUpload);
		await this.webApp.register(FastifyStatic, {
			root: resolve('data', 'upload'),
			prefix: '/upload',
			decorateReply: false
		});

		this.webApp.post<{ Body: { title: string; ts: string } }>('/upload', async (req, res) => {
			const files = req.raw.files;
			const file = files?.[0];
			if (!file) {
				res.status(400);
				res.send({ error: 'No file uploaded' });
				return;
			}

			const title = req.body.title;
			const ts = req.body.ts;

			const path = `/upload/${file.md5}${extname(file.name)}`;
			file.mv(`data/${path}`);

			const size = imageSize(file.data);
			if (!size.height || !size.width || !size.orientation) {
				throw new Error('Could not get size & orientation from image');
			}

			const ratio = size.orientation >= 5 ? size.height / size.width : size.width / size.height; // If the image is rotated 90° switch the ratio

			const id = await this.app.storage.run('INSERT INTO uploads (ts, title, img, ratio) VALUES (?, ?, ?, ?)', [
				ts,
				title,
				path,
				ratio
			]);

			if (this.items) {
				this.items.push({ id, ts, title, img: path, ratio });
			}

			res.status(201).send();
		});
		this.webApp.put<{ Params: { id: number }; Body: { img: string; title: string; ts: string } }>(
			'/upload/:id',
			async (req, res) => {
				const id = req.params.id;
				const ts = req.body.ts;
				const title = req.body.title;
				const img = req.body.img;

				await this.app.storage.run('UPDATE uploads SET ts = ?, title = ?, img = ? WHERE id = ?', [ts, title, img, id]);

				if (this.items) {
					this.items = this.items.map((item) => (item.id !== id ? item : { ...item, ts, title, img }));
				}

				res.status(200).send();
			}
		);
		this.webApp.delete<{ Params: { id: number } }>('/upload/:id', async (req, res) => {
			const id = req.params.id;

			if (this.items) {
				const item = this.items.find((item) => item.id === id);
				if (!item) {
					throw new Error(`Image not found`);
				}

				await rm(`data/${item.img}`);
				this.items = this.items.filter((item) => item.id !== id);
			}

			await this.app.storage.run('DELETE FROM uploads WHERE id = ?', [id]);

			res.status(200).send();
		});
	}

	protected override async doStart(): Promise<void> {
		this.screens = await this.app.storage.all('SELECT * FROM screens ORDER BY sort');
		this.log(`Loaded ${this.screens.length} screens`);

		if (this.uploads) {
			this.items = await this.app.storage.all('SELECT * FROM uploads');
			this.log(`Loaded ${this.items.length} uploaded images`);
		}

		if (!this.webApp) {
			throw new Error('WebApp not available');
		}

		const port = (process.env['SERVER_PORT'] ? Number(process.env['SERVER_PORT']) : 80) || 80;
		const addr = await this.webApp.listen({ port, host: '0.0.0.0' });
		this.log(`RUNNING ON ${addr}...`);
	}

	protected override async doStop(): Promise<void> {
		if (this.webApp) {
			await this.webApp.close();
		}

		this.screens = [];
		this.items = null;
	}

	protected override async doDispose(): Promise<void> {
		if (this.webApp) {
			this.webApp = null;
		}
	}
}

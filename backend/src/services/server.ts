import { mkdir, readdir, readFile, rm, writeFile } from 'fs/promises';
import Fastify, { FastifyInstance } from 'fastify';
import FastifyStatic from '@fastify/static';
import FastifyFileUpload from 'fastify-file-upload';
import cors from '@fastify/cors';
import mercurius, { IResolverObject, IResolvers } from 'mercurius';
import { extname, resolve } from 'path';
import imageSize from 'image-size';
import getDimensions from 'get-video-dimensions';
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
	ts: string;
	title: string;
	img: string;
	ratio: number;
}

export interface Screen {
	name: string;
	params: string;
}

declare module 'http' {
	interface IncomingMessage {
		files: File[];
	}
}

export class Server extends Service {
	public readonly uploadsEnabled = process.env['SERVER_UPLOAD_ENABLED'] === '1';

	private screens: Screen[] = [];
	private uploadItems: UploadItem[] | null = null;

	private webApp: FastifyInstance | null = null;

	protected override async doInit(): Promise<void> {
		await mkdir('./data/server/uploads', { recursive: true });

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
					items: () => this.uploadItems
				}),
				weather: () => ({
					hourly: () => this.app.weather.hourly,
					daily: () => this.app.weather.daily,
					alerts: () => this.app.weather.alerts
				})
			},
			Mutation: {
				saveScreens: async (_, { screens }: { screens: Screen[] }) => {
					this.screens = screens;
					await writeFile('./data/server/screens.json', JSON.stringify(screens), 'utf-8');
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
		if (!this.uploadsEnabled) {
			this.log('UPLOADS DISABLED');
			return;
		}

		await this.webApp.register(FastifyFileUpload);
		await this.webApp.register(FastifyStatic, {
			root: resolve('data', 'server', 'uploads'),
			prefix: '/uploads',
			decorateReply: false
		});

		this.webApp.post<{ Body: { title: string; ts: string } }>('/uploads', async (req, res) => {
			const files = req.raw.files;
			const file = files?.[0];
			if (!file) {
				res.status(400);
				res.send({ error: 'No file uploaded' });
				return;
			}

			const ts = req.body.ts;
			const title = req.body.title;
			const img = `${file.md5}${extname(file.name).toLowerCase()}`;

			const fileName = `./data/server/uploads/${img}`;
			file.mv(fileName);

			const ratio = await this.getRatio(fileName, file.data);

			if (this.uploadItems) {
				this.uploadItems.push({ ts, title, img, ratio });
				await writeFile('./data/server/uploads.json', JSON.stringify(this.uploadItems), 'utf-8');
			}

			res.status(201).send();
		});
		this.webApp.put<{ Params: { img: string }; Body: { title: string; ts: string } }>(
			'/uploads/:img',
			async (req, res) => {
				const img = req.params.img;
				const ts = req.body.ts;
				const title = req.body.title;

				if (this.uploadItems) {
					this.uploadItems = this.uploadItems.map((item) => (item.img !== img ? item : { ...item, ts, title }));
					await writeFile('./data/server/uploads.json', JSON.stringify(this.uploadItems), 'utf-8');
				}

				res.status(200).send();
			}
		);
		this.webApp.delete<{ Params: { img: string } }>('/uploads/:img', async (req, res) => {
			const img = req.params.img;

			if (this.uploadItems) {
				if (!this.uploadItems.some((item) => item.img === img)) {
					throw new Error(`Image not found`);
				}

				await rm(`./data/server/uploads/${img}`);
				this.uploadItems = this.uploadItems.filter((item) => item.img !== img);
				await writeFile('./data/server/uploads.json', JSON.stringify(this.uploadItems), 'utf-8');
			}

			res.status(200).send();
		});
	}

	protected override async doStart(): Promise<void> {
		this.screens = JSON.parse(await readFile('./data/server/screens.json', 'utf-8').catch(() => '[]'));
		this.log(`Loaded ${this.screens.length} screens`);

		if (this.uploadsEnabled) {
			const items: UploadItem[] = JSON.parse(await readFile('./data/server/uploads.json', 'utf-8').catch(() => '[]'));
			this.log(`Loaded ${items.length} uploaded images`);

			const files = await readdir('./data/server/uploads');
			for (const file of files) {
				if (items.some((item) => item.img === file)) {
					continue;
				}

				this.warn(`Found upload file without data entry: ${file}`);
				const ratio = await this.getRatio(`./data/server/uploads/${file}`);
				items.push({ ts: new Date().toISOString(), title: '', img: file, ratio });
			}

			this.uploadItems = items;
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
		this.uploadItems = null;
	}

	protected override async doDispose(): Promise<void> {
		if (this.webApp) {
			this.webApp = null;
		}
	}

	private async getRatio(fileName: string, data?: Buffer) {
		if (fileName.endsWith('.mp4')) {
			try {
				const dims = await getDimensions(fileName);
				return dims.width / dims.height;
			} catch (err) {
				this.error('Could not get video size', err);
			}
		} else {
			try {
				const size = imageSize(data ? data : await readFile(fileName));
				if (!size.height || !size.width || !size.orientation) {
					throw new Error(`Missing size information: ${JSON.stringify(size)}`);
				}

				return size.orientation >= 5 ? size.height / size.width : size.width / size.height; // If the image is rotated 90° switch the ratio
			} catch (err) {
				this.error('Could not get image size', err);
			}
		}

		return 1;
	}
}

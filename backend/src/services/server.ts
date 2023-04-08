import { createHash } from 'crypto';
import { exec } from 'child_process';
import { mkdir, readdir, readFile, rm, writeFile } from 'fs/promises';
import { parseISO } from 'date-fns';
import { resolve } from 'path';
import cors from '@fastify/cors';
import Fastify, { FastifyInstance } from 'fastify';
import FastifyStatic from '@fastify/static';
import getDimensions from 'get-video-dimensions';
import imageSize from 'image-size';
import mercurius, { IResolverObject, IResolvers } from 'mercurius';
import mime from 'mime-types';

import { Service } from './service';
import { GQL_SCHEMA } from './server-gql';

const UPLOADS_DIR = 'data/server/uploads';
const UPLOADS_PATH = 'data/server/uploads.json';
const SCREENS_PATH = 'data/server/screens.json';

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

export class Server extends Service {
	private readonly port = process.env['SERVER_PORT'] ? Number(process.env['SERVER_PORT']) : 80;
	private readonly host = process.env['SERVER_HOST'] || '0.0.0.0';
	private readonly uploadsEnabled = process.env['SERVER_UPLOAD_ENABLED'] === '1';

	private screens: Screen[] = [];
	private uploadItems: UploadItem[] | null = null;

	private webApp: FastifyInstance | null = null;

	protected override async doInit(): Promise<void> {
		await mkdir(UPLOADS_DIR, { recursive: true });

		this.webApp = Fastify({ maxParamLength: 255 });
		await this.webApp.register(cors, { origin: true, credentials: true });

		const resolvers: IResolvers = {
			Query: {
				battery: () => ({
					updatedAt: () => this.app.battery.updatedAt?.toISOString(),
					status: () => this.app.battery.status
				}),
				calendar: () => ({
					updatedAt: () => this.app.calendar.updatedAt?.toISOString(),
					events: () => this.app.calendar.events
				}),
				games: () => ({
					updatedAt: () => this.app.games.updatedAt?.toISOString(),
					freeEpic: () => this.app.games.freeEpic
				}),
				modem: () => ({
					updatedAt: () => this.app.modem.updatedAt?.toISOString(),
					status: () => this.app.modem.status
				}),
				network: () => ({
					updatedAt: () => this.app.modem.updatedAt?.toISOString(),
					interfaces: () => this.app.modem.interfaces
				}),
				news: (): IResolverObject => ({
					updatedAt: () => this.app.news.updatedAt?.toISOString(),
					items: ({ feed }) => this.app.news.getItems(feed)
				}),
				post: () => ({
					updatedAt: () => this.app.post.updatedAt?.toISOString(),
					shipments: () => this.app.post.shipments
				}),
				sbb: () => ({
					updatedAt: () => this.app.sbb.updatedAt?.toISOString(),
					alerts: () => this.app.sbb.alerts
				}),
				screens: () => this.screens,
				sensors: () => ({
					updatedAt: () => this.app.sensor.updatedAt?.toISOString(),
					newest: () => this.app.sensor.newest,
					recordings: () => this.app.sensor.getRecordings()
				}),
				uploads: () => ({
					items: () => this.uploadItems
				}),
				weather: () => ({
					updatedAt: () => this.app.weather.updatedAt?.toISOString(),
					hourly: () => this.app.weather.hourly,
					daily: () => this.app.weather.daily,
					alerts: () => this.app.weather.alerts
				})
			},
			Mutation: {
				saveScreens: async (_, { screens }: { screens: Screen[] }) => {
					this.screens = screens;
					await writeFile(SCREENS_PATH, JSON.stringify(screens), 'utf-8');
					return this.screens;
				},
				saveUpload: async (_, { img, ts, title }: { img: string; ts: string; title: string }) => {
					// If 'img' looks like a data url then we're uploading a new image, otherwise upading an existing one
					if (img.startsWith('data:')) {
						const data = Buffer.from(img.substring(img.indexOf(',')), 'base64');
						const hash = createHash('md5').update(ts, 'utf-8').update(title, 'utf-8').update(data).digest('hex');
						const ext = mime.extension(img.substring(5, img.indexOf(';')));

						img = `${hash}.${ext}`;
						const fileName = `${UPLOADS_DIR}/${img}`;

						await writeFile(fileName, data);
						const ratio = await this.getRatio(fileName, data);

						if (this.uploadItems) {
							this.uploadItems.push({ ts, title, img, ratio });
							await this.saveUploadItems();
						}
					} else {
						if (this.uploadItems) {
							this.uploadItems = this.uploadItems.map((item) => (item.img !== img ? item : { ...item, ts, title }));
							await this.saveUploadItems();
						}
					}

					return this.uploadItems;
				},
				deleteUpload: async (_, { img }: { img: string }) => {
					if (this.uploadItems) {
						if (!this.uploadItems.some((item) => item.img === img)) {
							throw new Error(`Image not found`);
						}

						await rm(`${UPLOADS_DIR}/${img}`);
						this.uploadItems = this.uploadItems.filter((item) => item.img !== img);
						await this.saveUploadItems();
					}

					return this.uploadItems;
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

		await this.webApp.register(FastifyStatic, {
			root: resolve(UPLOADS_DIR),
			prefix: '/' + UPLOADS_DIR,
			decorateReply: false
		});
	}

	protected override async doStart(): Promise<void> {
		this.screens = JSON.parse(await readFile(SCREENS_PATH, 'utf-8').catch(() => '[]'));
		this.log(`Loaded ${this.screens.length} screens`);

		if (this.uploadsEnabled) {
			const items: UploadItem[] = JSON.parse(await readFile(UPLOADS_PATH, 'utf-8').catch(() => '[]'));
			this.log(`Loaded ${items.length} uploaded images`);

			let added = false;
			const files = await readdir(UPLOADS_DIR);
			for (const file of files) {
				if (items.some((item) => item.img === file)) {
					continue;
				}

				this.warn(`Found upload file without data entry: ${file}`);
				const ratio = await this.getRatio(`${UPLOADS_DIR}/${file}`);
				items.push({ ts: new Date().toISOString(), title: '', img: file, ratio });
				added = true;
			}

			this.uploadItems = items;

			if (added) {
				await this.saveUploadItems();
			}
		} else {
			this.uploadItems = null;
		}

		if (!this.webApp) {
			throw new Error('WebApp not available');
		}

		const addr = await this.webApp.listen({ port: this.port, host: this.host });
		this.log(`RUNNING ON ${addr}...`);
	}

	protected override async doUpdate(): Promise<void> {
		// NO-OP
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
				if (!size.height || !size.width) {
					throw new Error(`Missing size information: ${JSON.stringify(size)}`);
				}

				return size.orientation && size.orientation >= 5 ? size.height / size.width : size.width / size.height; // If the image is rotated 90° switch the ratio
			} catch (err) {
				this.error('Could not get image size', err);
			}
		}

		return 1;
	}

	private async saveUploadItems() {
		if (!this.uploadItems) {
			return;
		}

		this.uploadItems = this.uploadItems.sort((a, b) => parseISO(a.ts).getTime() - parseISO(b.ts).getTime());
		await writeFile(UPLOADS_PATH, JSON.stringify(this.uploadItems), 'utf-8');
	}
}

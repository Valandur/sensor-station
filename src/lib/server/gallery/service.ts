import { createHash } from 'node:crypto';
import { error } from '@sveltejs/kit';
import { parseISO } from 'date-fns';
import { readFile, readdir, rm, writeFile } from 'node:fs/promises';
import getDimensions from 'get-video-dimensions';
import imageSize from 'image-size';
import mime from 'mime-types';
import { env } from '$env/dynamic/private';

import {
	GALLERY_SERVICE_TYPE,
	type GalleryImage,
	type GalleryServiceConfig,
	type GalleryServiceData,
	type GalleryServiceInstance
} from '$lib/models/gallery';

import { BaseService } from '../BaseService';

const ENABLED = env.UPLOADS_ENABLED === '1';
const UPLOADS_FILE = 'data/gallery/gallery.json';
const UPLOADS_DIR = 'data/gallery/';

class GalleryService extends BaseService<GalleryServiceConfig, GalleryServiceData> {
	public override readonly type = GALLERY_SERVICE_TYPE;

	private loaded = false;
	private uploads: GalleryImage[] = [];

	public constructor() {
		super('GALLERY');
	}

	public async get(
		{ name }: GalleryServiceInstance,
		forceUpdate?: boolean | undefined
	): Promise<GalleryServiceData> {
		if (!ENABLED) {
			error(400, {
				message: `Uploads is disabled`,
				key: 'uploads.disabled'
			});
		}

		if (!this.loaded) {
			await this.load();
			this.loaded = true;
		}

		return {
			ts: new Date(),
			name,
			images: this.uploads
		};
	}

	public validate(
		instance: GalleryServiceInstance,
		config: FormData
	): Promise<GalleryServiceConfig> {
		throw new Error('Method not implemented.');
	}

	public async storeUpload(ts: Date, title: string, file: File): Promise<GalleryImage[]> {
		const data = Buffer.from(await file.arrayBuffer());
		const hash = createHash('md5')
			.update(ts.toISOString(), 'utf-8')
			.update(title, 'utf-8')
			.update(data)
			.digest('hex');
		const ext = mime.extension(file.type);

		const img = `${hash}.${ext}`;
		const fileName = `${UPLOADS_DIR}/${img}`;

		await writeFile(fileName, data);
		const ratio = await this.getRatio(fileName, data);

		const newUploads = this.uploads.concat({ ts, title, img, ratio });
		await this.saveUploads(newUploads);

		return newUploads;
	}

	public async deleteUpload(index: number) {
		const item = this.uploads[index];

		await rm(`${UPLOADS_DIR}/${item.img}`);

		const newUploads = this.uploads.filter((_, i) => i !== index);
		await this.saveUploads(newUploads);
	}

	public async saveUploads(newUploads: GalleryImage[]): Promise<void> {
		this.uploads = newUploads.sort((a, b) => a.ts.getTime() - b.ts.getTime());

		this.logger.debug('Saving...');
		const startTime = process.hrtime.bigint();

		await writeFile(UPLOADS_FILE, JSON.stringify(newUploads), 'utf-8');

		const diffTime = (process.hrtime.bigint() - startTime) / 1000000n;
		this.logger.info('Saved', newUploads.length, 'uploads', diffTime, 'ms');
	}

	private async load() {
		this.logger.debug('Loading...');
		const startTime = process.hrtime.bigint();

		const newUploads: GalleryImage[] = JSON.parse(
			await readFile(UPLOADS_FILE, 'utf-8').catch(() => '[]')
		).map((item: Record<string, string>) => ({ ...item, ts: parseISO(item.ts) }));

		let added = false;
		const files = await readdir(UPLOADS_DIR).catch(() => []);
		for (const file of files) {
			if (newUploads.some((item) => item.img === file)) {
				continue;
			}
			if (file.endsWith('.json')) {
				continue;
			}

			this.logger.warn(`Found upload file without data entry: ${file}`);
			const ratio = await this.getRatio(`${UPLOADS_DIR}/${file}`);
			newUploads.push({ ts: new Date(), title: '', img: file, ratio });
			added = true;
		}

		this.uploads = newUploads;

		const diffTime = (process.hrtime.bigint() - startTime) / 1000000n;
		this.logger.info('Loaded', newUploads.length, 'uploads', diffTime, 'ms');

		if (added) {
			await this.saveUploads(newUploads);
		}
	}

	private async getRatio(fileName: string, data?: Buffer) {
		if (fileName.endsWith('.mp4')) {
			try {
				const dims = await getDimensions(fileName);
				return dims.width / dims.height;
			} catch (err) {
				this.logger.warn('Could not get video size', err);
			}
		} else {
			try {
				const size = imageSize(data ? data : await readFile(fileName));
				if (!size.height || !size.width) {
					throw new Error(`Missing size information: ${JSON.stringify(size)}`);
				}

				return size.orientation && size.orientation >= 5
					? size.height / size.width
					: size.width / size.height; // If the image is rotated 90° switch the ratio
			} catch (err) {
				this.logger.warn('Could not get image size', err);
			}
		}

		return 1;
	}
}

export default new GalleryService();

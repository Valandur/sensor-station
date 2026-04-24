import { createHash } from 'node:crypto';
import { error, fail } from '@sveltejs/kit';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import getDimensions from 'get-video-dimensions';
import imageSize from 'image-size';
import mime from 'mime-types';
import { env } from '$env/dynamic/private';

import { wrap } from '$lib/counter';
import {
	GALLERY_SERVICE_TYPE,
	GALLERY_SERVICE_ACTIONS,
	type GalleryServiceConfig
} from '$lib/models/gallery';

import { BaseService } from './service';

const ENABLED = env.GALLERY_ENABLED === '1';

export class GalleryService extends BaseService<GalleryServiceConfig> {
	public static readonly actions = GALLERY_SERVICE_ACTIONS;
	public override readonly type = GALLERY_SERVICE_TYPE;

	protected lastPage = 0;

	protected getDefaultConfig(): GalleryServiceConfig {
		return {
			images: []
		};
	}

	public async getConfig() {
		if (!ENABLED) {
			error(400, `Gallery is disabled`);
		}

		return this.config;
	}

	public async getImage({ page }: { page?: number | null }) {
		if (!ENABLED) {
			error(400, `Gallery is disabled`);
		}

		if (typeof page !== 'number') {
			page = this.lastPage + 1;
		}

		const [[image], prevPage, nextPage, index] = wrap(
			this.config.images.length,
			page,
			1,
			this.config.images
		);
		this.lastPage = index;

		return {
			prevPage,
			nextPage,
			image
		};
	}

	public async addImage({ date, title, image }: { date: Date; title: string; image: File }) {
		const data = Buffer.from(await image.arrayBuffer());
		const hash = createHash('md5').update(data).digest('hex');
		const ext = mime.extension(image.type);

		const folderPath = `data/${this.name}`;
		const img = `${folderPath}/${hash}.${ext}`;

		await mkdir(folderPath, { recursive: true });
		await writeFile(img, data);
		const ratio = await this.getRatio(img, data);

		console.log(date, title, img);
		this.config.images = this.config.images.concat({ date, title, img, ratio });
	}

	public async editImage(index: number, { date, title }: { date?: Date; title?: string }) {
		if (index < 0 || index > this.config.images.length - 1) {
			error(400, 'Index out of range');
		}

		if (date) {
			this.config.images[index].date = date;
		}
		if (typeof title === 'string') {
			this.config.images[index].title = title;
		}
	}

	public async moveImage(index: number, dir: 'up' | 'down') {
		if (dir === 'up') {
			if (index === 0) {
				return fail(400, { message: 'Invalid direction' });
			}

			this.config.images = [
				...this.config.images.slice(0, index - 1),
				this.config.images[index],
				this.config.images[index - 1],
				...this.config.images.slice(index + 1)
			];
		} else if (dir === 'down') {
			if (index === this.config.images.length - 1) {
				return fail(400, { message: 'Invalid direction' });
			}

			this.config.images = [
				...this.config.images.slice(0, index),
				this.config.images[index + 1],
				this.config.images[index],
				...this.config.images.slice(index + 2)
			];
		}
	}

	public async removeImage(index: number) {
		const item = this.config.images[index];

		await rm(`${item.img}`);

		this.config.images = this.config.images.filter((_, i) => i !== index);
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
					error(500, `Missing size information: ${JSON.stringify(size)}`);
				}

				return size.orientation && size.orientation >= 5
					? size.height / size.width // If the image is rotated 90° switch the ratio
					: size.width / size.height;
			} catch (err) {
				this.logger.warn('Could not get image size', err);
			}
		}

		return 1;
	}
}

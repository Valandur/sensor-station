import { createHash } from 'node:crypto';
import { error, fail } from '@sveltejs/kit';
import { parseISO } from 'date-fns';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import getDimensions from 'get-video-dimensions';
import imageSize from 'image-size';
import mime from 'mime-types';
import { env } from '$env/dynamic/private';

import type { ServiceActionFailure } from '$lib/models/service';
import {
	GALLERY_WIDGET_ACTIONS,
	type GalleryServiceAction,
	type GalleryServiceConfig,
	type GalleryServiceData
} from '$lib/models/gallery';

import {
	BaseService,
	type ServiceGetDataOptions,
	type ServiceSetDataOptions
} from '../BaseService';

const ENABLED = env.GALLERY_ENABLED === '1';

export class GalleryService extends BaseService<
	GalleryServiceAction,
	GalleryServiceConfig,
	GalleryServiceData
> {
	public static readonly actions = GALLERY_WIDGET_ACTIONS;

	protected generateDefaultConfig(): GalleryServiceConfig {
		return {
			images: []
		};
	}

	public async getData(
		action: GalleryServiceAction,
		options: ServiceGetDataOptions
	): Promise<GalleryServiceData | null> {
		if (!ENABLED) {
			error(400, {
				message: `Gallery is disabled`,
				key: 'gallery.disabled'
			});
		}

		return {
			ts: new Date(),
			name: this.name,
			type: this.type,
			action,
			images: this.config.images
		};
	}

	public async setData(
		action: GalleryServiceAction,
		{ form }: ServiceSetDataOptions
	): Promise<void | ServiceActionFailure> {
		if (action !== 'config') {
			error(400, { key: 'gallery.action.invalid', message: 'Invalid gallery action' });
		}

		const formAction = form.get('action');
		switch (formAction) {
			case 'add': {
				const newDateStr = form.get('newDate');
				if (typeof newDateStr !== 'string') {
					return fail(400, { key: 'gallery.form.newDate.invalid', message: 'Invalid date' });
				}
				const newDate = parseISO(newDateStr);

				const newTitle = form.get('newTitle');
				if (typeof newTitle !== 'string') {
					return fail(400, { key: 'gallery.form.newTitle.invalid', message: 'Invalid title' });
				}

				const newImage = form.get('newImage');
				if (!newImage || typeof newImage === 'string') {
					return fail(400, { key: 'gallery.form.newImage.invalid', message: 'Invalid image' });
				}

				await this.saveUpload(newDate, newTitle, newImage);
				break;
			}

			case 'delete': {
				const index = Number(form.get('index'));
				if (!isFinite(index)) {
					return fail(400, { key: 'gallery.form.index.invalid', message: 'Invalid index' });
				}

				await this.deleteUpload(index);
				break;
			}

			case 'save': {
				const index = Number(form.get('index'));
				if (!isFinite(index)) {
					return fail(400, { key: 'gallery.form.index.invalid', message: 'Invalid index' });
				}

				const dateStr = form.get('date');
				if (typeof dateStr !== 'string') {
					return fail(400, { key: 'gallery.form.date.invalid', message: 'Invalid date' });
				}
				const date = parseISO(dateStr);

				const title = form.get('title');
				if (typeof title !== 'string') {
					return fail(400, { key: 'gallery.form.title.invalid', message: 'Invalid title' });
				}

				this.config.images[index].ts = date;
				this.config.images[index].title = title;
				break;
			}

			case 'move': {
				const index = Number(form.get('index'));
				if (!isFinite(index)) {
					return fail(400, { key: 'gallery.form.index.invalid', message: 'Invalid index' });
				}

				const dir = form.get('dir');
				if (dir !== 'up' && dir !== 'down') {
					return fail(400, { key: 'gallery.form.dir.invalid', message: 'Invalid direction' });
				}

				if (dir === 'up') {
					if (index === 0) {
						return fail(400, { key: 'gallery.form.dir.invalid', message: 'Invalid direction' });
					}

					this.config.images = [
						...this.config.images.slice(0, index - 1),
						this.config.images[index],
						this.config.images[index - 1],
						...this.config.images.slice(index + 1)
					];
				} else if (dir === 'down') {
					if (index === this.config.images.length - 1) {
						return fail(400, { key: 'gallery.form.dir.invalid', message: 'Invalid direction' });
					}

					this.config.images = [
						...this.config.images.slice(0, index),
						this.config.images[index + 1],
						this.config.images[index],
						...this.config.images.slice(index + 2)
					];
				}
				break;
			}

			default: {
				return fail(400, {
					key: 'gallery.form.action.invalid',
					message: `Unknown form action ${formAction}`
				});
			}
		}
	}

	private async saveUpload(ts: Date, title: string, file: File) {
		const data = Buffer.from(await file.arrayBuffer());
		const hash = createHash('md5')
			.update(ts.toISOString(), 'utf-8')
			.update(title, 'utf-8')
			.update(data)
			.digest('hex');
		const ext = mime.extension(file.type);

		const folderPath = `data/${this.name}`;
		const img = `${folderPath}/${hash}.${ext}`;

		await mkdir(folderPath, { recursive: true });
		await writeFile(img, data);
		const ratio = await this.getRatio(img, data);

		this.config.images = this.config.images.concat({ ts, title, img, ratio });
	}

	public async deleteUpload(index: number) {
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

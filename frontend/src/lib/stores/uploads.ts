import { createHash } from 'crypto';
import { env } from '$env/dynamic/private';
import { parseISO } from 'date-fns';
import { readFile, readdir, writeFile } from 'fs/promises';
import getDimensions from 'get-video-dimensions';
import imageSize from 'image-size';
import mime from 'mime-types';

import { Counter } from '$lib/counter';
import type { UploadItem } from '$lib/models/UploadItem';

export const ENABLED = env.UPLOADS_ENABLED === '1';
const UPLOADS_DIR = 'static/data/uploads';
const UPLOADS_FILE = 'data/uploads.json';

export const counter = new Counter();

let loaded = false;
let uploads: UploadItem[] = [];

export async function getUploads() {
	if (loaded) {
		return uploads;
	}

	const items: UploadItem[] = JSON.parse(
		await readFile(UPLOADS_FILE, 'utf-8').catch(() => '[]')
	).map((item: Record<string, string>) => ({ ...item, ts: parseISO(item.ts) }));
	console.log(`Loaded ${items.length} uploaded images`);

	let added = false;
	const files = await readdir(UPLOADS_DIR).catch(() => []);
	for (const file of files) {
		if (file === 'uploads.json' || items.some((item) => item.img === file)) {
			continue;
		}

		console.warn(`Found upload file without data entry: ${file}`);
		const ratio = await getRatio(`${UPLOADS_DIR}/${file}`);
		items.push({ ts: new Date(), title: '', img: file, ratio });
		added = true;
	}

	loaded = true;
	uploads = items;
	counter.max = items.length;

	if (added) {
		await saveUploads(items);
	}

	return uploads;
}

export async function saveUploads(newUploads: UploadItem[]): Promise<void> {
	uploads = newUploads.sort((a, b) => a.ts.getTime() - b.ts.getTime());
	counter.max = newUploads.length;

	await writeFile(UPLOADS_FILE, JSON.stringify(newUploads), 'utf-8');
}

export async function storeUpload(ts: Date, title: string, file: File): Promise<UploadItem[]> {
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
	const ratio = await getRatio(fileName, data);

	const uploads = await getUploads();
	const newUploads = uploads.concat({ ts, title, img, ratio });
	await saveUploads(newUploads);

	return newUploads;
}

async function getRatio(fileName: string, data?: Buffer) {
	if (fileName.endsWith('.mp4')) {
		try {
			const dims = await getDimensions(fileName);
			return dims.width / dims.height;
		} catch (err) {
			console.error('Could not get video size', err);
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
			console.error('Could not get image size', err);
		}
	}

	return 1;
}

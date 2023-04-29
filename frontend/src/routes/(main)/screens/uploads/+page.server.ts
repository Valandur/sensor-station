import { env } from '$env/dynamic/private';
import { parseISO } from 'date-fns';
import { readFile, readdir, writeFile } from 'fs/promises';
import { redirect } from '@sveltejs/kit';
import getDimensions from 'get-video-dimensions';
import imageSize from 'image-size';

import { Counter } from '$lib/counter';
import type { UploadItem } from '$lib/models/UploadItem';

import type { PageServerLoad } from './$types';

const ENABLED = env.UPLOADS_ENABLED === '1';
const UPLOADS_DIR = 'static/data/uploads';
const UPLOADS_FILE = 'data/uploads.json';

const counter = new Counter();

export const load: PageServerLoad = async ({ url, parent }) => {
	if (!ENABLED) {
		throw redirect(302, '/screens');
	}

	let page = Number(url.searchParams.get('page') || '-');

	const uploads = await getUploads();
	counter.max = uploads.length;

	if (!isFinite(page)) {
		page = counter.increment();
	}

	const upload = uploads[page];
	const dataParent = await parent();

	return {
		upload,
		nextPage: `?screen=${dataParent.index}&page=${counter.wrap(page + 1)}`,
		prevPage: `?screen=${dataParent.index}&page=${counter.wrap(page - 1)}`
	};
};

let loaded = false;
let uploads: UploadItem[] = [];

async function getUploads() {
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
	if (added) {
		await saveUploads();
	}

	loaded = true;
	uploads = items;

	return uploads;
}

async function saveUploads() {
	uploads = uploads.sort((a, b) => a.ts.getTime() - b.ts.getTime());
	await writeFile(UPLOADS_FILE, JSON.stringify(uploads), 'utf-8');
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

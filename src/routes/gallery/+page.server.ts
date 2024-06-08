import { fail } from '@sveltejs/kit';
import { parseISO } from 'date-fns';

import service from '$lib/server/gallery/service';
import services from '$lib/server/services';
import type { GalleryImage } from '$lib/models/gallery';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const instance = services.allOfType(service.type);
	const { images } = await service.get(instance[0]);

	return {
		images
	};
};

export const actions: Actions = {
	add: async ({ request }) => {
		const data = await request.formData();

		const newDateStr = data.get('newDate');
		if (typeof newDateStr !== 'string') {
			return fail(400, { newDate: newDateStr, invalid: true });
		}
		const newDate = parseISO(newDateStr);

		const newTitle = data.get('newTitle');
		if (typeof newTitle !== 'string') {
			return fail(400, { newTitle, invalid: true });
		}

		const newImage = data.get('newImage');
		if (!newImage || typeof newImage === 'string') {
			return fail(400, { newImage, invalid: true });
		}

		await service.storeUpload(newDate, newTitle, newImage);
	},
	save: async ({ request }) => {
		const data = await request.formData();

		const index = data.get('index');
		if (typeof index !== 'string') {
			return fail(400, { index, invalid: true });
		}

		const idx = Number(index);
		if (!isFinite(idx)) {
			return fail(400, { index, invalid: true });
		}

		const dateStr = data.get('date');
		if (typeof dateStr !== 'string') {
			return fail(400, { date: dateStr, invalid: true });
		}
		const date = parseISO(dateStr);

		const title = data.get('title');
		if (typeof title !== 'string') {
			return fail(400, { title, invalid: true });
		}

		// TODO: Fix getting the first service of type
		const instance = services.allOfType(service.type);
		const { images } = await service.get(instance[0]);
		if (idx < 0 || idx > images.length - 1) {
			return fail(400, { index, outOfRange: true });
		}

		const newUploads = images.map((upload, i) => (i !== idx ? upload : { ...upload, date, title }));
		service.saveUploads(newUploads);
	},
	delete: async ({ request }) => {
		const data = await request.formData();

		const index = data.get('index');
		if (typeof index !== 'string') {
			return fail(400, { index, invalid: true });
		}

		const idx = Number(index);
		if (!isFinite(idx)) {
			return fail(400, { index, invalid: true });
		}

		await service.deleteUpload(idx);
	},
	move: async ({ request }) => {
		const data = await request.formData();

		const index = data.get('index');
		if (typeof index !== 'string') {
			return fail(400, { index, invalid: true });
		}

		const dir = data.get('dir');
		if (typeof dir !== 'string' || (dir !== 'up' && dir !== 'down')) {
			return fail(400, { dir, invalid: true });
		}

		const idx = Number(index);
		if (!isFinite(idx)) {
			return fail(400, { index, invalid: true });
		}

		const instance = services.allOfType(service.type);
		const { images } = await service.get(instance[0]);
		if (idx < 0 || idx > images.length - 1) {
			return fail(400, { index, outOfRange: true });
		}

		let newUploads: GalleryImage[] = [];
		if (dir === 'up') {
			if (idx === 0) {
				return fail(400, { dir, notPossible: true });
			} else {
				newUploads = [
					...images.slice(0, idx - 1),
					images[idx],
					images[idx - 1],
					...images.slice(idx + 1)
				];
			}
		} else {
			if (idx === images.length - 2) {
				return fail(400, { dir, notPossible: true });
			} else {
				newUploads = [
					...images.slice(0, idx),
					images[idx + 1],
					images[idx],
					...images.slice(idx + 2)
				];
			}
		}

		service.saveUploads(newUploads);
	}
};

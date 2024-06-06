import { fail } from '@sveltejs/kit';
import { parseISO } from 'date-fns';

import { deleteUpload, getUploads, saveUploads, storeUpload } from '$lib/server/uploads/data';
import type { UploadItem } from '$lib/models/UploadItem';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const uploads = await getUploads();
	return {
		uploads
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

		await storeUpload(newDate, newTitle, newImage);
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

		const uploads = await getUploads();
		if (idx < 0 || idx > uploads.length - 1) {
			return fail(400, { index, outOfRange: true });
		}

		const newUploads = uploads.map((upload, i) =>
			i !== idx ? upload : { ...upload, date, title }
		);
		saveUploads(newUploads);
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

		await deleteUpload(idx);
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

		const uploads = await getUploads();
		if (idx < 0 || idx > uploads.length - 1) {
			return fail(400, { index, outOfRange: true });
		}

		let newUploads: UploadItem[] = [];
		if (dir === 'up') {
			if (idx === 0) {
				return fail(400, { dir, notPossible: true });
			} else {
				newUploads = [
					...uploads.slice(0, idx - 1),
					uploads[idx],
					uploads[idx - 1],
					...uploads.slice(idx + 1)
				];
			}
		} else {
			if (idx === uploads.length - 2) {
				return fail(400, { dir, notPossible: true });
			} else {
				newUploads = [
					...uploads.slice(0, idx),
					uploads[idx + 1],
					uploads[idx],
					...uploads.slice(idx + 2)
				];
			}
		}

		saveUploads(newUploads);
	}
};

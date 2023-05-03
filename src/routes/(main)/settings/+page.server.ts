import { fail } from '@sveltejs/kit';

import { getScreens, saveScreens } from '$lib/server/screen';
import type { Screen } from '$lib/models/Screen';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const screens = await getScreens();

	return {
		screens
	};
};

export const actions: Actions = {
	add: async ({ request }) => {
		const data = await request.formData();

		const newName = data.get('newName');
		if (typeof newName !== 'string') {
			return fail(400, { newName, invalid: true });
		}

		const newParams = data.get('newParams');
		if (typeof newParams !== 'string') {
			return fail(400, { newParams, invalid: true });
		}

		const screens = await getScreens();

		const newScreens = screens.concat({ name: newName, params: newParams });
		saveScreens(newScreens);
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

		const screens = await getScreens();
		if (idx < 0 || idx > screens.length - 1) {
			return fail(400, { index, outOfRange: true });
		}

		const newScreens = screens.filter((_, i) => i !== idx);
		saveScreens(newScreens);
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

		const screens = await getScreens();
		if (idx < 0 || idx > screens.length - 1) {
			return fail(400, { index, outOfRange: true });
		}

		let newScreens: Screen[] = [];
		if (dir === 'up') {
			if (idx === 0) {
				return fail(400, { dir, notPossible: true });
			} else {
				newScreens = [
					...screens.slice(0, idx - 1),
					screens[idx],
					screens[idx - 1],
					...screens.slice(idx + 1)
				];
			}
		} else {
			if (idx === screens.length - 2) {
				return fail(400, { dir, notPossible: true });
			} else {
				newScreens = [
					...screens.slice(0, idx),
					screens[idx + 1],
					screens[idx],
					...screens.slice(idx + 2)
				];
			}
		}

		saveScreens(newScreens);
	}
};

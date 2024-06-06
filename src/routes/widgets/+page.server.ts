import { fail } from '@sveltejs/kit';

import widgetService from '$lib/server/widgets';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const widgets = widgetService.all();
	const types = widgetService.types();
	return {
		types,
		widgets: widgets.map((w) => ({ name: w.name, type: w.type }))
	};
};

export const actions: Actions = {
	add: async ({ request }) => {
		const data = await request.formData();

		const newName = data.get('newName');
		if (typeof newName !== 'string') {
			return fail(400, { newName: 'invalid' });
		}

		const newType = data.get('newType');
		if (typeof newType !== 'string') {
			return fail(400, { newType: 'invalid' });
		}

		try {
			await widgetService.add(newName, newType);
		} catch (err) {
			if (err && typeof err === 'object' && 'status' in err) {
				return err;
			}
			throw err;
		}
	},
	delete: async ({ request }) => {
		const data = await request.formData();

		const name = data.get('name');
		if (typeof name !== 'string') {
			return fail(400, { name: 'invalid' });
		}

		await widgetService.remove(name);
	}
};

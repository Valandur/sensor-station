import { fail } from '@sveltejs/kit';

import servicesManager from '$lib/server/services';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const types = servicesManager.getTypes().sort((a, b) => a.name.localeCompare(b.name));
	const services = servicesManager.getInstances().sort((a, b) => a.name.localeCompare(b.name));

	return {
		types,
		services
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
			await servicesManager.add(newName, newType);
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

		await servicesManager.remove(name);
	}
};

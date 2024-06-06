import { fail } from '@sveltejs/kit';

import servicesService from '$lib/server/services';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const services = servicesService.all();
	const types = servicesService.types();
	return {
		types,
		services: [...services.values()].map((s) => ({ name: s.name, type: s.type }))
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
			await servicesService.add(newName, newType);
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

		await servicesService.remove(name);
	}
};

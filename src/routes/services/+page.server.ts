import { fail } from '@sveltejs/kit';

import manager from '$lib/server/manager';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const main = manager.getMain();
	const types = manager.getTypes().sort((a, b) => a.name.localeCompare(b.name));
	const services = manager.getInstances().sort((a, b) => a.name.localeCompare(b.name));

	return {
		main,
		types,
		services
	};
};

export const actions: Actions = {
	save: async ({ request }) => {
		const data = await request.formData();

		const mainService = data.get('mainService');
		if (typeof mainService !== 'string') {
			return fail(400, { message: 'Invalid main service' });
		}

		manager.getByName(mainService);

		const mainAction = data.get('mainAction');
		if (typeof mainAction !== 'string') {
			return fail(400, { message: 'Invalid main action' });
		}

		await manager.setMain(mainService, mainAction);
	},
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
			await manager.add(newName, newType);
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

		await manager.remove(name);
	}
};

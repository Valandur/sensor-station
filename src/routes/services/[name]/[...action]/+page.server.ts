import { fail } from '@sveltejs/kit';

import serviceManager from '$lib/server/services';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url, cookies }) => {
	const name = params.name;
	const action = params.action;

	const service = serviceManager.getByName(name);
	const data = await service.get(action, { url, cookies, embedded: false });

	return {
		name: service.name,
		type: service.type,
		action,
		data
	};
};

export const actions: Actions = {
	default: async ({ params, request, url, cookies }) => {
		const form = await request.formData();

		const name = form.get('name');
		if (typeof name !== 'string') {
			return fail(400, { name, error: true, message: 'Invalid service name' });
		}

		const action = params.action;
		const service = serviceManager.getByName(name);

		try {
			const result = await service.set(action, { url, cookies, form, embedded: false });
			await serviceManager.save();
			if (result) {
				return result;
			} else {
				return { success: true };
			}
		} catch (err) {
			const msg =
				err && typeof err === 'object' && 'message' in err
					? typeof err.message === 'string' ||
						typeof err.message === 'boolean' ||
						typeof err.message === 'number'
						? err.message.toString()
						: JSON.stringify(err.message)
					: JSON.stringify(err);
			return fail(400, { name, error: true, message: msg });
		}
	}
};

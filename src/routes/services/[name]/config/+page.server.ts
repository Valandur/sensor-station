import { error, fail, type Actions } from '@sveltejs/kit';

import servicesService from '$lib/server/services';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const name = params.name;
	const instance = servicesService.byName(name);
	if (!instance) {
		error(404, { key: 'service.notFound', message: 'Service not found' });
	}

	const config = instance.config;

	return {
		name: instance.name,
		type: instance.type,
		config
	};
};

export const actions: Actions = {
	save: async ({ request }) => {
		const data = await request.formData();

		const name = data.get('name');
		if (typeof name !== 'string') {
			return fail(400, { name, error: true, message: 'Invalid service name' });
		}

		const service = servicesService.byName(name);
		if (!service) {
			return fail(400, { name, error: true, message: 'Service not found' });
		}

		try {
			const { config } = await servicesService.set(service, data);
			return { success: true, config };
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

import { error, fail, type Actions } from '@sveltejs/kit';

import widgetService from '$lib/server/widgets';
import servicesService from '$lib/server/services';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const name = params.name;
	const instance = widgetService.byName(name);
	if (!instance) {
		error(404, { key: 'widget.notFound', message: 'Widget not found' });
	}

	const services = [...servicesService.all().values()];
	const config = instance.config;

	return {
		name: instance.name,
		type: instance.type,
		config,
		services
	};
};

export const actions: Actions = {
	save: async ({ request }) => {
		const data = await request.formData();

		const name = data.get('name');
		if (typeof name !== 'string') {
			return fail(400, { name, error: true, message: 'Invalid widget name' });
		}

		const widget = widgetService.byName(name);
		if (!widget) {
			return fail(400, { name, error: true, message: 'Widget not found' });
		}

		try {
			const { config } = await widgetService.set(widget, data);
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

import { fail } from '@sveltejs/kit';

import widgetManager from '$lib/server/widgets';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url, cookies }) => {
	const name = params.name;
	const action = params.action;

	const widget = widgetManager.getByName(name);
	const data = await widget.getData(action, { url, cookies });

	return {
		name: widget.name,
		type: widget.type,
		data
	};
};

export const actions: Actions = {
	default: async ({ params, request, url, cookies }) => {
		const form = await request.formData();

		const name = form.get('name');
		if (typeof name !== 'string') {
			return fail(400, { name, error: true, message: 'Invalid widget name' });
		}

		const action = params.action;
		const widget = widgetManager.getByName(name);

		try {
			const result = await widget.setData(action, { url, cookies, form });
			await widgetManager.save();
			if (result) {
				result.data.success = false;
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

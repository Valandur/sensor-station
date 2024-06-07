import { error } from '@sveltejs/kit';

import widgetService from '$lib/server/widgets';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const name = params.name;
	const instance = widgetService.byName(name);
	if (!instance) {
		error(404, { key: 'widget.notFound', message: `Widget ${name} found` });
	}

	const action = params.action;
	const props = await widgetService.getAction(instance, action);
	if (!props) {
		error(404, { key: 'widget.actionNotFound', message: `Widget action ${action} not found` });
	}

	return {
		name: instance.name,
		type: instance.type,
		action,
		...props
	};
};

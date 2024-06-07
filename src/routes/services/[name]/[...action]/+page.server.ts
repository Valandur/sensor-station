import { error } from '@sveltejs/kit';

import servicesService from '$lib/server/services';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const name = params.name;
	const instance = servicesService.byName(name);
	if (!instance) {
		error(404, { key: 'service.notFound', message: `Service ${name} found` });
	}

	const action = params.action;
	const props = await servicesService.actionByName(name, action);
	if (!props) {
		error(404, { key: 'service.actionNotFound', message: `Service action ${action} not found` });
	}

	return {
		type: instance.type,
		action: params.action,
		props
	};
};

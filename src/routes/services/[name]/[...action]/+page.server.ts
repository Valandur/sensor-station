import manager from '$lib/server/manager';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const name = params.name;
	const action = params.action;
	const service = manager.getByName(name);

	return {
		name: service.name,
		type: service.type,
		action
	};
};

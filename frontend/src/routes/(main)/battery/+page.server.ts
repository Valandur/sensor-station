import { redirect } from '@sveltejs/kit';

import { ENABLED, getStatus } from '$lib/stores/battery';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	if (!ENABLED) {
		throw redirect(302, '/screens');
	}

	const status = await getStatus();

	return {
		status
	};
};

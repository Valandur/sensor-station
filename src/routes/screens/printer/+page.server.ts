import { redirect } from '@sveltejs/kit';

import { getData } from '$lib/server/printer/data';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const info = await getData();

	const dataParent = await parent();

	if ((!info.job || !info.job.id) && dataParent.skipScreen) {
		throw redirect(302, dataParent.skipScreen);
	}

	return {
		info
	};
};

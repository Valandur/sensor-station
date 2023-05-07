import { redirect } from '@sveltejs/kit';

import { ENABLED, getDaily } from '$lib/server/weather';

import type { PageServerLoad } from './$types';

const NUM_FORECASTS = 7;

export const load: PageServerLoad = async () => {
	if (!ENABLED) {
		throw redirect(302, '/screens');
	}

	const [location, forecasts] = await getDaily();

	return {
		location,
		daily: forecasts.slice(0, NUM_FORECASTS)
	};
};

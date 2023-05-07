import { redirect } from '@sveltejs/kit';

import { ENABLED, getDaily } from '$lib/server/weather';

import type { PageServerLoad } from './$types';

const NUM_FORECASTS = 7;

export const load: PageServerLoad = async () => {
	if (!ENABLED) {
		throw redirect(302, '/screens');
	}

	const [lat, lng, forecasts] = await getDaily();

	return {
		lat,
		lng,
		daily: forecasts.slice(0, NUM_FORECASTS)
	};
};

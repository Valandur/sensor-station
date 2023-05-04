import { error, redirect } from '@sveltejs/kit';

import { ENABLED, getDaily } from '$lib/server/weather';

import type { PageServerLoad } from './$types';

const NUM_FORECASTS = 7;

export const load: PageServerLoad = async () => {
	if (!ENABLED) {
		throw redirect(302, '/screens');
	}

	const forecasts = await getDaily().catch((err) => error(500, (err as Error).message));
	if (!('length' in forecasts)) {
		console.error(forecasts);
		throw forecasts;
	}

	return {
		daily: forecasts.slice(0, NUM_FORECASTS)
	};
};

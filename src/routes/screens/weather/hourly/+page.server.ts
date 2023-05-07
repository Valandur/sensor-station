import { redirect } from '@sveltejs/kit';
import { isAfter } from 'date-fns';

import { ENABLED, getHourly } from '$lib/server/weather';

import type { PageServerLoad } from './$types';

const NUM_FORECASTS = 7;

export const load: PageServerLoad = async () => {
	if (!ENABLED) {
		throw redirect(302, '/screens');
	}

	const [location, forecasts] = await getHourly();

	const now = new Date();

	return {
		location,
		hourly: forecasts
			.filter((f) => isAfter(f.ts, now))
			.filter((_, i) => i % 2 === 0)
			.slice(0, NUM_FORECASTS)
	};
};

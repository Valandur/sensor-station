import { error, redirect } from '@sveltejs/kit';
import { isAfter } from 'date-fns';

import { ENABLED, getHourly } from '$lib/server/weather';

import type { PageServerLoad } from './$types';

const NUM_FORECASTS = 7;

export const load: PageServerLoad = async () => {
	if (!ENABLED) {
		throw redirect(302, '/screens');
	}

	const forecasts = await getHourly().catch((err) => error(500, (err as Error).message));
	if (!('length' in forecasts)) {
		console.error(forecasts);
		throw forecasts;
	}

	const now = new Date();

	return {
		hourly: forecasts
			.filter((f) => isAfter(f.ts, now))
			.filter((_, i) => i % 2 === 0)
			.slice(0, NUM_FORECASTS)
	};
};

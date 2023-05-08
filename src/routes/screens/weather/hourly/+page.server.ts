import { isAfter } from 'date-fns';

import { getData } from '$lib/server/weather/data';

import type { PageServerLoad } from './$types';

const NUM_FORECASTS = 7;

export const load: PageServerLoad = async () => {
	const data = await getData();

	const now = new Date();

	return {
		location: data.location,
		hourly: data.hourly
			.filter((f) => isAfter(f.ts, now))
			.filter((_, i) => i % 2 === 0)
			.slice(0, NUM_FORECASTS)
	};
};

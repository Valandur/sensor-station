import { getData } from '$lib/server/weather/data';

import type { PageServerLoad } from './$types';

const NUM_FORECASTS = 7;

export const load: PageServerLoad = async () => {
	const data = await getData();

	return {
		location: data.location,
		daily: data.daily.slice(0, NUM_FORECASTS)
	};
};

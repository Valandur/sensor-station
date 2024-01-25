import { Counter } from '$lib/counter';
import { getData } from '$lib/server/weather/data';

import type { PageServerLoad } from './$types';

const counter = new Counter({
	maxSliceSize: 7
});

export const load: PageServerLoad = async () => {
	const data = await getData();
	counter.max = data.daily.length;

	return {
		location: data.location,
		daily: counter.slice(data.daily)
	};
};

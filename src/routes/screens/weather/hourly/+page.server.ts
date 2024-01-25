import { isAfter } from 'date-fns';

import { Counter } from '$lib/counter';
import { getData } from '$lib/server/weather/data';

import type { PageServerLoad } from './$types';

const counter = new Counter({
	maxSliceSize: 7
});

export const load: PageServerLoad = async () => {
	const data = await getData();

	const now = new Date();
	const hourly = data.hourly.filter((f) => isAfter(f.ts, now)).filter((_, i) => i % 2 === 0);
	counter.max = hourly.length;

	return {
		location: data.location,
		hourly: counter.slice(hourly)
	};
};

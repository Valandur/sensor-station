import { redirect } from '@sveltejs/kit';
import { isAfter } from 'date-fns';

import { Counter } from '$lib/counter';
import { getData } from '$lib/server/sbb/data';

import type { PageServerLoad } from './$types';

const counter = new Counter({
	maxSliceSize: 6
});

export const load: PageServerLoad = async ({ url, parent }) => {
	const data = await getData();

	const now = new Date();
	const allDepartures = data.departures.filter((d) => isAfter(d.estimated, now));
	counter.max = allDepartures.length;

	let page = Number(url.searchParams.get('page') || '---');
	if (!isFinite(page)) {
		page = 0;
	}

	const departures = counter.slice(allDepartures, page);
	const dataParent = await parent();

	if (!departures && dataParent.skipScreen) {
		throw redirect(302, dataParent.skipScreen);
	}

	return {
		departures,
		nextPage: `${dataParent.currScreen}&page=${counter.fit(page + 1)}`,
		prevPage: `${dataParent.currScreen}&page=${counter.fit(page - 1)}`
	};
};

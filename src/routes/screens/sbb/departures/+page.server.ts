import { redirect } from '@sveltejs/kit';

import { Counter } from '$lib/counter';
import { getData } from '$lib/server/sbb/data';

import type { PageServerLoad } from './$types';
import { isAfter } from 'date-fns';

const MAX_ITEMS = 6;

const counter = new Counter();

export const load: PageServerLoad = async ({ url, parent }) => {
	const data = await getData();
	const now = new Date();
	const allDepartures = data.departures.filter((d) => isAfter(d.estimated, now));

	counter.max = allDepartures.length;

	let page = Number(url.searchParams.get('page') || '-');
	if (!isFinite(page)) {
		page = 0;
	}

	const departures = allDepartures.slice(page, page + MAX_ITEMS);
	const dataParent = await parent();

	if (!departures && dataParent.skipScreen) {
		throw redirect(302, dataParent.skipScreen);
	}

	return {
		departures,
		nextPage: `${dataParent.currScreen}&page=${counter.wrap(page + 1)}`,
		prevPage: `${dataParent.currScreen}&page=${page > 0 ? page - 1 : 0}`
	};
};

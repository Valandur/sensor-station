import { redirect } from '@sveltejs/kit';

import { Counter } from '$lib/counter';
import { getData } from '$lib/server/calendar/data';

import type { PageServerLoad } from './$types';

const counter = new Counter({
	maxSliceSize: 6
});

export const load: PageServerLoad = async ({ url, parent }) => {
	const data = await getData();
	counter.max = data.events.length;

	let page = Number(url.searchParams.get('page') || '---');
	if (!isFinite(page)) {
		page = 0;
	}

	const events = counter.slice(data.events, page);
	const dataParent = await parent();

	if (!events && dataParent.skipScreen) {
		throw redirect(302, dataParent.skipScreen);
	}

	return {
		events,
		nextPage: `${dataParent.currScreen}&page=${counter.fit(page + 1)}`,
		prevPage: `${dataParent.currScreen}&page=${page > 0 ? page - 1 : 0}`
	};
};

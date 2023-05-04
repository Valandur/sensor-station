import { redirect } from '@sveltejs/kit';

import { Counter } from '$lib/counter';
import { ENABLED, getEvents } from '$lib/server/calendar';

import type { PageServerLoad } from './$types';

const MAX_ITEMS = 7;

const counter = new Counter();

export const load: PageServerLoad = async ({ url, parent }) => {
	if (!ENABLED) {
		throw redirect(302, '/screens');
	}

	const allEvents = await getEvents();
	counter.max = allEvents.length;

	let page = Number(url.searchParams.get('page') || '-');
	if (!isFinite(page)) {
		page = 0;
	}

	const events = allEvents.slice(page, page + MAX_ITEMS);
	const dataParent = await parent();

	return {
		events,
		nextPage: `${dataParent.currScreen}&page=${counter.wrap(page + 1)}`,
		prevPage: `${dataParent.currScreen}&page=${page > 0 ? page - 1 : 0}`
	};
};

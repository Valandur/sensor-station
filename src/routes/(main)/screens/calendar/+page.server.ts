import { error, redirect } from '@sveltejs/kit';

import { Counter } from '$lib/counter';
import { ENABLED, getEvents } from '$lib/server/calendar';

import type { PageServerLoad } from './$types';

const MAX_ITEMS = 7;

const counter = new Counter();

export const load: PageServerLoad = async ({ url, parent }) => {
	if (!ENABLED) {
		throw redirect(302, '/screens');
	}

	let page = Number(url.searchParams.get('page') || '-');

	const allEvents = await getEvents().catch((err) => error(500, (err as Error).message));
	if (!('length' in allEvents)) {
		console.error(allEvents);
		throw allEvents;
	}

	counter.max = allEvents.length;

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

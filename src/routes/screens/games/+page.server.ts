import { redirect } from '@sveltejs/kit';

import { Counter } from '$lib/counter';
import { ENABLED, getFreeEpicGames } from '$lib/server/games';

import type { PageServerLoad } from './$types';

const MAX_ITEMS = 2;

const counter = new Counter();

export const load: PageServerLoad = async ({ url, parent }) => {
	if (!ENABLED) {
		throw redirect(302, '/screens');
	}

	const allGames = await getFreeEpicGames();
	counter.max = allGames.length;

	let page = Number(url.searchParams.get('page') || '-');
	if (!isFinite(page)) {
		page = counter.increment();
	}

	const games = counter.sliceAndWrap(allGames, MAX_ITEMS, page);
	const dataParent = await parent();

	return {
		games,
		nextPage: `${dataParent.currScreen}&page=${counter.wrap(page + 1)}`,
		prevPage: `${dataParent.currScreen}&page=${counter.wrap(page - 1)}`
	};
};

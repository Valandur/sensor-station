import { Counter } from '$lib/counter';
import { getData } from '$lib/server/games/data';

import type { PageServerLoad } from './$types';

const MAX_ITEMS = 2;

const counter = new Counter();

export const load: PageServerLoad = async ({ url, parent }) => {
	const data = await getData();
	counter.max = data.games.length;

	let page = Number(url.searchParams.get('page') || '-');
	if (!isFinite(page)) {
		page = counter.increment();
	}

	const games = counter.sliceAndWrap(data.games, MAX_ITEMS, page);
	const dataParent = await parent();

	return {
		games,
		nextPage: `${dataParent.currScreen}&page=${counter.wrap(page + 1)}`,
		prevPage: `${dataParent.currScreen}&page=${counter.wrap(page - 1)}`
	};
};

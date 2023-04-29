import { Counter } from '$lib/counter';

import type { PageServerLoad } from './$types';

const counter = new Counter();

export const load: PageServerLoad = async ({ url, parent }) => {
	let page = Number(url.searchParams.get('page') || '-');

	const { alerts, index } = await parent();
	counter.max = alerts.length;

	if (!isFinite(page)) {
		page = counter.increment();
	}

	const alert = alerts[page];

	return {
		alert,
		nextPage: `?screen=${index}&page=${counter.wrap(page + 1)}`,
		prevPage: `?screen=${index}&page=${counter.wrap(page - 1)}`
	};
};

import { Counter } from '$lib/counter';
import { redirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

const counter = new Counter();

export const load: PageServerLoad = async ({ url, parent }) => {
	let page = Number(url.searchParams.get('page') || '-');

	const dataParent = await parent();
	counter.max = dataParent.alerts.length;

	if (!isFinite(page)) {
		page = counter.increment();
	}

	const alert = dataParent.alerts[page];

	if (!alert && dataParent.skipScreen) {
		throw redirect(302, dataParent.skipScreen);
	}

	return {
		alert,
		nextPage: `${dataParent.currScreen}&page=${counter.wrap(page + 1)}`,
		prevPage: `${dataParent.currScreen}&page=${counter.wrap(page - 1)}`
	};
};

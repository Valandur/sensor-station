import { redirect } from '@sveltejs/kit';

import { Counter, CounterType } from '$lib/counter';
import { getData } from '$lib/server/sbb/data';

import type { PageServerLoad } from './$types';

const counter = new Counter({
	type: CounterType.Wrap
});

export const load: PageServerLoad = async ({ url, parent }) => {
	const data = await getData();
	counter.max = data.alerts.length;

	let page = Number(url.searchParams.get('page') || '---');
	if (!isFinite(page)) {
		page = counter.increment();
	}

	const alert = data.alerts[page];
	const dataParent = await parent();

	if (!alert && dataParent.skipScreen) {
		throw redirect(302, dataParent.skipScreen);
	}

	return {
		alert,
		nextPage: `${dataParent.currScreen}&page=${counter.fit(page + 1)}`,
		prevPage: `${dataParent.currScreen}&page=${counter.fit(page - 1)}`
	};
};

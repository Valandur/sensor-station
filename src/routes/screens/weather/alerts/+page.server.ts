import { Counter } from '$lib/counter';
import { redirect } from '@sveltejs/kit';

import { ENABLED, getAlerts } from '$lib/server/weather';

import type { PageServerLoad } from './$types';

const counter = new Counter();

export const load: PageServerLoad = async ({ url, parent }) => {
	if (!ENABLED) {
		throw redirect(302, '/screens');
	}

	const [lat, lng, alerts] = await getAlerts();
	counter.max = alerts.length;

	let page = Number(url.searchParams.get('page') || '-');
	if (!isFinite(page)) {
		page = counter.increment();
	}

	const alert = alerts[page];
	const dataParent = await parent();

	if (!alert && dataParent.skipScreen) {
		throw redirect(302, dataParent.skipScreen);
	}

	return {
		lat,
		lng,
		alert,
		nextPage: `${dataParent.currScreen}&page=${counter.wrap(page + 1)}`,
		prevPage: `${dataParent.currScreen}&page=${counter.wrap(page - 1)}`
	};
};

import { error, redirect } from '@sveltejs/kit';

import { Counter } from '$lib/counter';
import { ENABLED, getAlerts } from '$lib/server/sbb';

import type { PageServerLoad } from './$types';

const counter = new Counter();

export const load: PageServerLoad = async ({ url, parent }) => {
	if (!ENABLED) {
		throw redirect(302, '/screens');
	}

	let page = Number(url.searchParams.get('page') || '-');

	const alerts = await getAlerts().catch((err) => error(500, (err as Error).message));
	if (!('length' in alerts)) {
		console.error(alerts);
		throw alerts;
	}

	counter.max = alerts.length;
	if (!isFinite(page)) {
		page = counter.increment();
	}

	const alert = alerts[page];
	const dataParent = await parent();

	if (!alert && dataParent.skipScreen) {
		throw redirect(302, dataParent.skipScreen);
	}

	return {
		alert,
		nextPage: `${dataParent.currScreen}&page=${counter.wrap(page + 1)}`,
		prevPage: `${dataParent.currScreen}&page=${counter.wrap(page - 1)}`
	};
};

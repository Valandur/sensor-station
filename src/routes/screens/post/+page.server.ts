import { error, redirect } from '@sveltejs/kit';

import { Counter } from '$lib/counter';
import { ENABLED, getShipments } from '$lib/server/post';

import type { PageServerLoad } from './$types';

const counter = new Counter();

export const load: PageServerLoad = async ({ url, parent }) => {
	if (!ENABLED) {
		throw redirect(302, '/screens');
	}

	let page = Number(url.searchParams.get('page') || '-');

	const shipments = await getShipments().catch((err) => error(500, (err as Error).message));
	if (!('length' in shipments)) {
		console.error(shipments);
		throw shipments;
	}

	counter.max = shipments.length;
	if (!isFinite(page)) {
		page = counter.increment();
	}

	const shipment = shipments[page];
	const dataParent = await parent();

	if (!shipment && dataParent.skipScreen) {
		throw redirect(302, dataParent.skipScreen);
	}

	return {
		shipment,
		nextPage: `${dataParent.currScreen}&page=${counter.wrap(page + 1)}`,
		prevPage: `${dataParent.currScreen}&page=${counter.wrap(page - 1)}`
	};
};

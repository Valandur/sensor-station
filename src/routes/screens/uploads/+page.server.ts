import { redirect } from '@sveltejs/kit';

import { Counter } from '$lib/counter';
import { ENABLED, getUploads } from '$lib/server/uploads';

import type { PageServerLoad } from './$types';

const counter = new Counter();

export const load: PageServerLoad = async ({ url, parent }) => {
	if (!ENABLED) {
		throw redirect(302, '/screens');
	}

	const uploads = await getUploads();
	counter.max = uploads.length;

	let page = Number(url.searchParams.get('page') || '-');
	if (!isFinite(page)) {
		page = counter.increment();
	}

	const upload = uploads[page];
	const dataParent = await parent();

	return {
		upload,
		nextPage: `${dataParent.currScreen}&page=${counter.wrap(page + 1)}`,
		prevPage: `${dataParent.currScreen}&page=${counter.wrap(page - 1)}`
	};
};

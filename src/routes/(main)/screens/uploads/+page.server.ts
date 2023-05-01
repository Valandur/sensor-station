import { error, redirect } from '@sveltejs/kit';

import { Counter } from '$lib/counter';
import { ENABLED, getUploads } from '$lib/server/uploads';

import type { PageServerLoad } from './$types';

const counter = new Counter();

export const load: PageServerLoad = async ({ url, parent }) => {
	if (!ENABLED) {
		throw redirect(302, '/screens');
	}

	let page = Number(url.searchParams.get('page') || '-');

	const uploads = await getUploads().catch((err) => error(500, (err as Error).message));
	if (!('length' in uploads)) {
		console.error(uploads);
		throw uploads;
	}

	counter.max = uploads.length;
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

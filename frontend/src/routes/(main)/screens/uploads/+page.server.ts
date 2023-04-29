import { redirect } from '@sveltejs/kit';

import { ENABLED, counter, getUploads } from '$lib/stores/uploads';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, parent }) => {
	if (!ENABLED) {
		throw redirect(302, '/screens');
	}

	let page = Number(url.searchParams.get('page') || '-');

	const uploads = await getUploads();

	if (!isFinite(page)) {
		page = counter.increment();
	}

	const upload = uploads[page];
	const dataParent = await parent();

	return {
		upload,
		nextPage: `?screen=${dataParent.index}&page=${counter.wrap(page + 1)}`,
		prevPage: `?screen=${dataParent.index}&page=${counter.wrap(page - 1)}`
	};
};

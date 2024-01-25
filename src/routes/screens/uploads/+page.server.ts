import { Counter, CounterType } from '$lib/counter';
import { getUploads } from '$lib/server/uploads/data';

import type { PageServerLoad } from './$types';

const counter = new Counter({
	type: CounterType.Wrap
});

export const load: PageServerLoad = async ({ url, parent }) => {
	const uploads = await getUploads();
	counter.max = uploads.length;

	let page = Number(url.searchParams.get('page') || '---');
	if (!isFinite(page)) {
		page = counter.increment();
	}

	const upload = uploads[page];
	const dataParent = await parent();

	return {
		upload,
		nextPage: `${dataParent.currScreen}&page=${counter.fit(page + 1)}`,
		prevPage: `${dataParent.currScreen}&page=${counter.fit(page - 1)}`
	};
};

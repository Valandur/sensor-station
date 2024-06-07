import { SIMPLE_DETAILS, getArticle } from '$lib/server/srf/data';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const feedId = params.feed;
	const articleId = params.article;

	const article = await getArticle(feedId, articleId);

	return {
		simple: SIMPLE_DETAILS,
		article
	};
};

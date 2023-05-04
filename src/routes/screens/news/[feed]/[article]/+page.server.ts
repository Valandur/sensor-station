import { redirect } from '@sveltejs/kit';

import { ENABLED, SIMPLE_DETAILS, getArticle } from '$lib/server/news';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	if (!ENABLED) {
		throw redirect(302, '/screens');
	}

	const feedId = params.feed;
	const articleId = params.article;

	const article = await getArticle(feedId, articleId);

	return {
		simple: SIMPLE_DETAILS,
		article
	};
};

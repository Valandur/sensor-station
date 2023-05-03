import { redirect } from '@sveltejs/kit';

import { ENABLED, SIMPLE_DETAILS, getArticle } from '$lib/server/news';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	if (!ENABLED) {
		throw redirect(302, '/screens');
	}

	const { head, main, scripts } = await getArticle(params.article);

	return {
		simple: SIMPLE_DETAILS,
		head,
		main,
		scripts
	};
};

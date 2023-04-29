import { env } from '$env/dynamic/private';
import { redirect } from '@sveltejs/kit';

import type { LayoutServerLoad } from './$types';

const ENABLED = env.NEWS_ENABLED === '1';

export const load: LayoutServerLoad = async () => {
	if (!ENABLED) {
		throw redirect(302, '/screens');
	}
};

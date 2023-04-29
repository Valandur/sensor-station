import { redirect } from '@sveltejs/kit';

import { getScreenUrl, getScreens } from '$lib/stores/screen';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ url }) => {
	const index = Number(url.searchParams.get('screen') || '-');
	const urlScreenName = url.pathname;

	const screens = await getScreens();

	if (urlScreenName.length <= 8 && screens.length > 0) {
		throw redirect(302, getScreenUrl(0));
	}

	const idx = isFinite(index) ? index : null;
	const curr = idx !== null ? getScreenUrl(index) : null;
	const nextScreen = idx !== null ? getScreenUrl(idx + 1) : null;
	const prevScreen = idx !== null ? getScreenUrl(idx - 1) : null;

	if (curr && !curr.startsWith(urlScreenName)) {
		throw redirect(302, curr);
	}

	return {
		index,
		screens,
		nextScreen,
		prevScreen
	};
};

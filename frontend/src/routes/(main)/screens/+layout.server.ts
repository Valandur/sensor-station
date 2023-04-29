import { redirect } from '@sveltejs/kit';

import { getScreenUrl, getScreens } from '$lib/stores/screen';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ url }) => {
	const index = Number(url.searchParams.get('screen') || '-');
	const dir = url.searchParams.get('dir') === 'prev' ? 'prev' : 'next';
	const urlScreenName = url.pathname;

	const screens = await getScreens();

	if (urlScreenName.length <= 8 && screens.length > 0) {
		throw redirect(302, getScreenUrl(0, dir));
	}

	const idx = isFinite(index) ? index : null;

	const currScreen = idx !== null ? getScreenUrl(index, dir) : null;
	if (currScreen && !currScreen.startsWith(urlScreenName)) {
		throw redirect(302, currScreen);
	}

	const nextScreen = idx !== null ? getScreenUrl(idx + 1, 'next') : null;
	const prevScreen = idx !== null ? getScreenUrl(idx - 1, 'prev') : null;
	const skipScreen = idx !== null ? (dir === 'next' ? nextScreen : prevScreen) : null;

	return {
		dir,
		index,
		screens,
		currScreen,
		nextScreen,
		prevScreen,
		skipScreen
	};
};

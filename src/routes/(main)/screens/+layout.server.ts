import { redirect } from '@sveltejs/kit';

import { getHoliday } from '$lib/server/holidays';
import { getScreenUrl, getScreens } from '$lib/server/screen';
import { getStatus as getBatteryStatus } from '$lib/server/battery';
import { getStatus as getModemStatus } from '$lib/server/modem';
import type { Screen } from '$lib/models/Screen';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ url, depends }) => {
	const index = Number(url.searchParams.get('screen') || '-');
	const dir = url.searchParams.get('dir') === 'prev' ? 'prev' : 'next';
	const urlScreenName = url.pathname;

	const [screens, modem, battery] = await Promise.all([
		getScreens().catch(() => [] as Screen[]),
		getModemStatus().catch(() => null),
		getBatteryStatus().catch(() => null)
	]);

	depends('screens:layout');

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
	const holiday = getHoliday();

	return {
		dir,
		index,
		screens,
		currScreen,
		nextScreen,
		prevScreen,
		skipScreen,
		modem,
		battery,
		holiday
	};
};

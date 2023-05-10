import { redirect } from '@sveltejs/kit';

import { Counter } from '$lib/counter';
import { getData as getBatteryData } from '$lib/server/battery/data';
import { getData as getModemData } from '$lib/server/modem/data';
import { getHoliday } from '$lib/server/holidays';
import { getScreenUrl, getScreens } from '$lib/server/screen/data';
import type { Screen } from '$lib/models/Screen';

import type { LayoutServerLoad } from './$types';

const counter = new Counter();

export const load: LayoutServerLoad = async ({ url, depends }) => {
	const index = Number(url.searchParams.get('screen') || '-');
	const dir = url.searchParams.get('dir') === 'prev' ? 'prev' : 'next';
	const urlScreenName = url.pathname;

	const [screens, battery, modem] = await Promise.all([
		getScreens().catch(() => [] as Screen[]),
		getBatteryData().catch(() => null),
		getModemData().catch(() => null)
	]);

	depends('screens:layout');

	counter.max = screens.length;

	if (urlScreenName.length <= 8 && screens.length > 0) {
		throw redirect(302, getScreenUrl(0, dir));
	}

	const idx = isFinite(index) ? counter.wrap(index) : null;
	const currScreen = idx !== null ? getScreenUrl(idx, dir) : null;
	if (currScreen && !currScreen.startsWith(urlScreenName)) {
		throw redirect(302, currScreen);
	}

	const nextScreen = idx !== null ? getScreenUrl(counter.wrap(idx + 1), 'next') : null;
	const prevScreen = idx !== null ? getScreenUrl(counter.wrap(idx - 1), 'prev') : null;
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

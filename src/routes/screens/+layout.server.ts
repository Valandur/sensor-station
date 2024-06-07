import { error, redirect } from '@sveltejs/kit';

import { Counter, CounterType } from '$lib/counter';
import { getData as getBatteryData } from '$lib/server/battery/data';
import { getData as getModemData } from '$lib/server/modem/data';
import { getHoliday } from '$lib/server/holidays';
import { getScreenUrl, getScreens } from '$lib/server/screen/data';
import type { Screen } from '$lib/models/Screen';

import type { LayoutServerLoad } from './$types';

const counter = new Counter({
	type: CounterType.Wrap
});

export const load: LayoutServerLoad = async ({ url, depends }) => {
	const index = Number(url.searchParams.get('screen') || '---');
	const dir = url.searchParams.get('dir') === 'prev' ? 'prev' : 'next';
	const urlScreenName = url.pathname;
	const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;

	const [screens, battery, modem] = await Promise.all([
		getScreens().catch(() => [] as Screen[]),
		getBatteryData().catch(() => null),
		getModemData().catch(() => null)
	]);
	const holiday = getHoliday();

	depends('screens:layout');

	counter.max = screens.length;

	// If no screen name is provided and we have at least one, redirect to the first screen
	if (urlScreenName.length <= 8 && screens.length > 0) {
		redirect(302, getScreenUrl(0, dir));
	}

	const idx = isFinite(index) ? counter.fit(index) : null;
	const currScreen = idx !== null ? getScreenUrl(idx, dir) : null;
	if (currScreen && !currScreen.startsWith(urlScreenName)) {
		redirect(302, currScreen);
	}

	let page = Number(url.searchParams.get('page') || '---');
	if (!isFinite(page)) {
		page = 0;
	}

	const nextScreen = idx !== null ? getScreenUrl(counter.fit(idx + 1), 'next') : null;
	const prevScreen = idx !== null ? getScreenUrl(counter.fit(idx - 1), 'prev') : null;
	const skipScreen = idx !== null ? (dir === 'next' ? nextScreen : prevScreen) : null;

	return {
		dir,
		index,
		page,
		screens,
		currScreen,
		nextScreen,
		prevScreen,
		skipScreen,
		modem,
		battery,
		holiday,
		tz: modem?.gps?.tz || modem?.geo?.tz || modem?.cellular.tz || localTz
	};
};

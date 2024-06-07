import { error, redirect } from '@sveltejs/kit';

import { Counter, CounterType } from '$lib/counter';
import { getData as getBatteryData } from '$lib/server/battery/data';
import { getData as getModemData } from '$lib/server/modem/data';
import { getHoliday } from '$lib/server/holidays';
import carouselService from '$lib/server/carousel';
import widgetsService from '$lib/server/widgets';
import type { BaseProps } from '$lib/models/BaseProps';

import type { PageServerLoad } from './$types';

const counter = new Counter({
	type: CounterType.Wrap
});

function getScreenUrl(index: number, dir: 'next' | 'prev' = 'next', page: number = 0) {
	return `/carousel?screen=${index}&dir=${dir}&page=${page}`;
}

export const load: PageServerLoad = async ({ url, depends }) => {
	const dir = url.searchParams.get('dir') === 'prev' ? 'prev' : 'next';
	let index = Number(url.searchParams.get('screen') || '---');
	if (!isFinite(index)) {
		index = 0;
	}
	let page = Number(url.searchParams.get('page') || '---');
	if (!isFinite(page)) {
		page = 0;
	}

	const [carousel, battery, modem] = await Promise.all([
		carouselService.get(),
		getBatteryData().catch(() => null),
		getModemData().catch(() => null)
	]);
	const holiday = getHoliday();

	depends('carousel');

	const screens = carousel.screens;
	counter.max = screens.length;
	const idx = counter.fit(index);

	const screen = screens[idx];
	const nextScreen = getScreenUrl(counter.fit(idx + 1), 'next');
	const prevScreen = getScreenUrl(counter.fit(idx - 1), 'prev');
	const skipScreen = screens.length > 1 ? (dir === 'next' ? nextScreen : prevScreen) : null;
	const switchInterval = carousel.switchInterval;
	const updateInterval = carousel.updateInterval;

	let props: BaseProps | null = null;
	let prevPage: string | null = null;
	let nextPage: string | null = null;
	if (screen) {
		props = await widgetsService.props(screen.widget, page);
		if (!props && skipScreen) {
			redirect(302, skipScreen);
		} else if (!props) {
			error(500, { key: 'props.missing', message: "Missing props and can't skip screen" });
		}

		if (typeof props.prevPage === 'number') {
			prevPage = getScreenUrl(idx, dir, props.prevPage);
		}
		if (typeof props.nextPage === 'number') {
			nextPage = getScreenUrl(idx, dir, props.nextPage);
		}
	}

	return {
		dir,
		index,
		page,
		switchInterval,
		updateInterval,
		screens,
		screen,
		nextScreen,
		prevScreen,
		skipScreen,
		prevPage,
		nextPage,
		modem,
		battery,
		holiday,
		props
	};
};

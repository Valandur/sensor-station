import { readFile, writeFile } from 'fs/promises';
import { redirect } from '@sveltejs/kit';

import { Counter } from '$lib/counter';
import type { Screen } from '$lib/models/Screen';

import type { LayoutServerLoad } from './$types';

const SCREENS_PATH = 'data/screens.json';

const counter = new Counter();

export const load: LayoutServerLoad = async ({ url }) => {
	const index = Number(url.searchParams.get('screen') || '-');
	const urlScreenName = url.pathname;

	const screens = await getScreens();
	counter.max = screens.length;

	if (urlScreenName.length <= 8 && screens.length > 0) {
		throw redirect(302, getScreenUrl(0));
	}

	const idx = isFinite(index) ? counter.wrap(index) : null;
	const curr = idx !== null ? getScreenUrl(index) : null;
	const nextScreen = idx !== null ? getScreenUrl(idx + 1) : null;
	const prevScreen = idx !== null ? getScreenUrl(idx - 1) : null;

	if (curr && !curr.startsWith(urlScreenName)) {
		throw redirect(302, curr);
	}

	return {
		index,
		nextScreen,
		prevScreen
	};
};

let loaded = false;
let screens: Screen[] = [];

function getScreenUrl(index: number) {
	const idx = counter.wrap(index);
	const screen = screens[idx];
	return `/screens/${screen.name}/${screen.params ?? ''}?screen=${idx}`;
}

async function getScreens() {
	if (loaded) {
		return screens;
	}

	const newScreens = JSON.parse(await readFile(SCREENS_PATH, 'utf-8').catch(() => '[]'));
	console.log(`Loaded ${newScreens.length} screens`);

	loaded = true;
	screens = newScreens;

	return screens;
}

async function saveScreens() {
	await writeFile(SCREENS_PATH, JSON.stringify(screens), 'utf-8');
}

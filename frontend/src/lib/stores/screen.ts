import { readFile, writeFile } from 'fs/promises';

import { Counter } from '$lib/counter';
import type { Screen } from '$lib/models/Screen';

const SCREENS_PATH = 'data/screens.json';

let loaded = false;
let screens: Screen[] = [];
const counter = new Counter();

export function getScreenUrl(newIndex: number, dir: 'next' | 'prev' = 'next') {
	const idx = counter.wrap(newIndex);
	const screen = screens[idx];
	return `/screens/${screen.name}/${screen.params ?? ''}?screen=${idx}&dir=${dir}`;
}

export async function getScreens() {
	if (loaded) {
		return screens;
	}

	const newScreens = JSON.parse(await readFile(SCREENS_PATH, 'utf-8').catch(() => '[]'));
	console.log(`Loaded ${newScreens.length} screens`);

	loaded = true;
	screens = newScreens;
	counter.max = newScreens.length;

	return screens;
}

export async function saveScreens(newScreens: Screen[]) {
	loaded = true;
	screens = newScreens;
	counter.max = newScreens.length;

	await writeFile(SCREENS_PATH, JSON.stringify(newScreens), 'utf-8');
}

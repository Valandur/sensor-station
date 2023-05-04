import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

import { Counter } from '$lib/counter';
import { Logger } from '$lib/logger';
import type { Screen } from '$lib/models/Screen';

const SCREENS_PATH = 'data/screens.json';

const logger = new Logger('SCREENS');

let loaded = false;
let screens: Screen[] = [];
const counter = new Counter();

export function getScreenUrl(index: number, dir: 'next' | 'prev' = 'next') {
	const idx = counter.wrap(index);
	const screen = screens[idx];
	return `/screens/${screen.name}/${screen.params ?? ''}?screen=${idx}&dir=${dir}`;
}

export async function getScreens() {
	if (loaded) {
		return screens;
	}

	logger.debug('Loading...');
	const startTime = process.hrtime.bigint();

	await mkdir(dirname(SCREENS_PATH), { recursive: true });
	const newScreens = JSON.parse(await readFile(SCREENS_PATH, 'utf-8').catch(() => '[]'));

	loaded = true;
	screens = newScreens;
	counter.max = newScreens.length;

	const diffTime = (process.hrtime.bigint() - startTime) / 1000000n;
	logger.info('Loaded', newScreens.length, 'screens', diffTime, 'ms');

	return screens;
}

export async function saveScreens(newScreens: Screen[]) {
	loaded = true;
	screens = newScreens;
	counter.max = newScreens.length;

	logger.debug('Saving...');
	const startTime = process.hrtime.bigint();

	await writeFile(SCREENS_PATH, JSON.stringify(newScreens), 'utf-8');

	const diffTime = (process.hrtime.bigint() - startTime) / 1000000n;
	logger.info('Saved', newScreens.length, 'screens', diffTime, 'ms');
}

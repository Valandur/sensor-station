import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

import { BaseLogger } from '$lib/models/BaseLogger';
import type { Screen } from '$lib/models/Screen';

const SCREENS_PATH = 'data/screens.json';

const logger = new BaseLogger('SCREENS');

let screens: Screen[] = [];

export function getScreenUrl(index: number, dir: 'next' | 'prev' = 'next') {
	const screen = screens[index];
	return `/screens/${screen.name}/${screen.params ?? ''}?screen=${index}&dir=${dir}`;
}

export async function getScreens() {
	return screens;
}

export async function saveScreens(newScreens: Screen[]) {
	screens = newScreens;

	logger.debug('Saving...');
	const startTime = process.hrtime.bigint();

	await writeFile(SCREENS_PATH, JSON.stringify(newScreens), 'utf-8');

	const diffTime = (process.hrtime.bigint() - startTime) / 1000000n;
	logger.info('Saved', newScreens.length, 'screens', diffTime, 'ms');
}

export async function setup() {
	logger.debug('Loading...');
	const startTime = process.hrtime.bigint();

	await mkdir(dirname(SCREENS_PATH), { recursive: true });
	const newScreens = JSON.parse(await readFile(SCREENS_PATH, 'utf-8').catch(() => '[]'));

	screens = newScreens;

	const diffTime = (process.hrtime.bigint() - startTime) / 1000000n;
	logger.info('Loaded', newScreens.length, 'screens', diffTime, 'ms');
}

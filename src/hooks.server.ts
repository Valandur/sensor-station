import { normalize, resolve as resolvePath } from 'path';
import { readFile } from 'fs/promises';
import type { Handle, HandleServerError } from '@sveltejs/kit';

import { building } from '$app/environment';

import { BaseLogger } from '$lib/models/BaseLogger';
import { setup as setupBattery } from '$lib/server/battery/data';
import { setup as setupScreens } from '$lib/server/screen/data';
import { setup as setupSensor } from '$lib/server/sensor/data';
import { setup as setupUploads } from '$lib/server/uploads/data';
import servicesService from '$lib/server/services';
import widgetService from '$lib/server/widgets';

const logger = new BaseLogger('MAIN');

await init();

export const handle: Handle = async ({ event, resolve }) => {
	const path = event.url.pathname;
	if (path.startsWith('/data/')) {
		const file = await readFile(resolvePath('.' + normalize(path)));
		return new Response(file, { status: 200 });
	}

	const response = await resolve(event);
	return response;
};

export const handleError: HandleServerError = async ({ error, event }) => {
	logger.error(error);
	return {
		message: error instanceof Error ? error.message : JSON.stringify(error),
		key: 'unhandled',
		params: { route: event.route, error: JSON.parse(JSON.stringify(error)) }
	};
};

async function init() {
	if (building) {
		return;
	}

	logger.info('Starting...');

	await servicesService.get();
	await widgetService.get();
	setupBattery();
	setupScreens();
	setupSensor();
	setupUploads();
}

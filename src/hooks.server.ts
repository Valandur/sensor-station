import { normalize, resolve as resolvePath } from 'path';
import { readFile } from 'fs/promises';
import type { Handle, HandleServerError } from '@sveltejs/kit';
import { building } from '$app/environment';

import { Logger } from '$lib/server/Logger';
import servicesService from '$lib/server/services';

const logger = new Logger('MAIN');

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
		params: { route: event.route, error: JSON.parse(JSON.stringify(error)) }
	};
};

async function init() {
	if (building) {
		return;
	}

	logger.info('Starting...');

	await servicesService.load();
}

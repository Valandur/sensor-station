import type { Handle, HandleServerError, ServerInit } from '@sveltejs/kit';
import { readFile } from 'fs/promises';
import { normalize, resolve as resolvePath } from 'path';

import { Logger } from '$lib/server/logger';
import manager from '$lib/server/manager';

const logger = new Logger('MAIN');

export const init: ServerInit = async () => {
	logger.info('Starting...');

	await manager.load();
};

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

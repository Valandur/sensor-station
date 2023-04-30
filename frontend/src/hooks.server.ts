import { normalize, resolve as resolvePath } from 'path';
import { readFile } from 'fs/promises';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const path = event.url.pathname;
	if (path.startsWith('/data/uploads')) {
		const file = await readFile(resolvePath('.' + normalize(path)));
		return new Response(file, { status: 200 });
	}

	const response = await resolve(event);
	return response;
};

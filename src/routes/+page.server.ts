import { redirect, type Actions } from '@sveltejs/kit';
import { exec } from 'node:child_process';

import type { PageServerLoad } from './$types';
import serviceManager from '$lib/server/services';

export const load: PageServerLoad = async () => {
	const main = serviceManager.getMain();
	if (main) {
		throw redirect(302, `/services/${main.name}/${main.action}`);
	}

	throw redirect(302, '/services');
};

export const actions: Actions = {
	restart: async () => {
		exec('sudo /sbin/shutdown -r now', (msg) => console.log(msg));
	}
};

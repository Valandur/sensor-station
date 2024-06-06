import { redirect, type Actions } from '@sveltejs/kit';
import { exec } from 'node:child_process';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	throw redirect(302, '/carousel');
};

export const actions: Actions = {
	restart: async () => {
		exec('sudo /sbin/shutdown -r now', (msg) => console.log(msg));
	}
};

import { redirect, type Actions } from '@sveltejs/kit';
import { exec } from 'node:child_process';
import { format } from 'date-fns/format';
import chalk from 'chalk';

import serviceManager from '$lib/server/manager';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const main = serviceManager.getMain();
	if (main) {
		throw redirect(302, `/services/${main.name}/${main.action}`);
	}

	throw redirect(302, '/services');
};

export const actions: Actions = {
	restart: async () => {
		exec('sudo /sbin/shutdown -r now', (msg) =>
			console.log(
				`${chalk.grey(format(new Date(), 'HH:mm:ss'))} [${chalk.gray('WARN')}] [${chalk.green('MAIN')}] ${msg}`
			)
		);
	}
};

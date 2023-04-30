import { exec } from 'child_process';

import type { Actions } from './$types';

export const actions: Actions = {
	restart: async () => {
		exec('sudo /sbin/shutdown -r now', (msg) => console.log(msg));
	}
};

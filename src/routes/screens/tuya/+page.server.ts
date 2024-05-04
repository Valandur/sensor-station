import { getData } from '$lib/server/tuya/data';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const info = await getData();
	return {
		info
	};
};

import { getStatus } from '$lib/server/network';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const status = await getStatus();

	return {
		status
	};
};

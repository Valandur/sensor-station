import { getStatus } from '$lib/server/modem';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const status = await getStatus();

	return {
		status
	};
};

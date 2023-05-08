import { getData } from '$lib/server/network/data';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const data = await getData(true);

	return {
		...data
	};
};

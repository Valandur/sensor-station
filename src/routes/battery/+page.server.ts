import { getData } from '$lib/server/battery/data';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const data = await getData(true);

	return {
		...data
	};
};

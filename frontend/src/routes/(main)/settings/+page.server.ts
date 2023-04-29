import { getScreens } from '$lib/stores/screen';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const screens = await getScreens();

	return {
		screens
	};
};

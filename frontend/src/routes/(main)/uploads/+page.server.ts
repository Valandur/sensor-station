import type { PageServerLoad } from './$types';

import { getUploads } from '$lib/stores/uploads';

export const load: PageServerLoad = async () => {
	const uploads = getUploads();

	return {
		uploads
	};
};

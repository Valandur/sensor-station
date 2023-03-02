import { PUBLIC_API_URL } from '$env/static/public';

import { createClient } from '@urql/svelte';

type FetchType = typeof fetch;

export const BASE_URL = PUBLIC_API_URL;

export const FETCH_OPTIONS = {
	credentials: 'include'
};

export function getClient(fetch: FetchType) {
	return createClient({
		url: `${BASE_URL}/graphql`,
		fetch,
		fetchOptions: { credentials: 'include' }
	});
}

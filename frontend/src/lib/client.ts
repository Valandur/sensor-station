import { dev } from '$app/environment';
import { PUBLIC_API_URL } from '$env/static/public';

import { cacheExchange, createClient, fetchExchange } from '@urql/svelte';

type FetchType = typeof fetch;

export const BASE_URL = dev ? PUBLIC_API_URL : '';

export const FETCH_OPTIONS = {
	credentials: 'include'
};

export function getClient(fetch?: FetchType) {
	return createClient({
		fetch,
		url: `${BASE_URL}/graphql`,
		fetchOptions: { credentials: 'include' },
		exchanges: [cacheExchange, fetchExchange]
	});
}

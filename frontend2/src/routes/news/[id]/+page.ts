import { createClient, gql } from '@urql/svelte';

import type { RawNewsData } from '$lib/models/news';

import type { PageLoad } from './$types';

const URL = 'http://localhost:2000';

export const load: PageLoad = async ({ fetch, params }) => {
	const client = createClient({
		url: `${URL}/graphql`,
		fetch,
		fetchOptions: { credentials: 'include' }
	});

	const { data } = await client
		.query<{ news: RawNewsData }>(
			gql`
				query GetNews($feed: String!) {
					news(feed: $feed) {
						ts
						title
						link
						origLink
						description
						img
					}
				}
			`,
			{ feed: params.id }
		)
		.toPromise();

	return {
		url: URL,
		news: data?.news
	};
};

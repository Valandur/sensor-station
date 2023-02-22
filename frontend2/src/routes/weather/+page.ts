import { createClient, gql } from '@urql/svelte';

import type { RawWeatherData } from '$lib/models/weather';

import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const client = createClient({
		url: 'http://localhost:2000/graphql',
		fetch,
		fetchOptions: { credentials: 'include' }
	});

	const { data } = await client
		.query<{ weather: RawWeatherData }>(
			gql`
				{
					weather {
						forecasts {
							ts
							img
							feelsLike
						}
						alerts {
							sender
							event
							start
							end
							description
							tags
						}
						temp
						rh
					}
				}
			`,
			{}
		)
		.toPromise();

	return {
		weather: data?.weather
	};
};

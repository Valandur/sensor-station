<script lang="ts" context="module">
	const QUERY = gql`
		query Games {
			...GamesFree
		}
		${GAMES_FREE}
	`;

	export const gamesMeta: ComponentMeta<Game[]> = {
		getData: async () => {
			const client = getClient();
			const res = await client
				.query<GamesFree>(
					QUERY,
					{},
					{ additionalTypenames: ['Game'], requestPolicy: 'cache-and-network' }
				)
				.toPromise();
			if (res.error) {
				throw res.error;
			}
			if (!res.data) {
				throw new Error('Could not get data for games');
			}
			return res.data.games.freeEpic || [];
		}
	};
</script>

<script lang="ts">
	import { gql } from '@urql/svelte';
	import { format, parseISO } from 'date-fns';
	import { onDestroy } from 'svelte';

	import { GAMES_FREE, type Game, type GamesFree } from '$lib/models/games';
	import { getClient } from '$lib/client';
	import { getStore } from '$lib/stores/counter';
	import type { ComponentMeta } from '$lib/component';

	export let params: string = '';
	params; // svelte hack to disable unused variable warning
	export let data: Game[];

	const MAX_ITEMS = 2;

	$: index = getStore('games', data.length - 1);
	$: games = [...data.slice($index, $index + MAX_ITEMS)];

	onDestroy(async () => {
		index.increment();
	});

	const fmt = (date: string) => format(parseISO(date), 'dd MMM');
</script>

<div class="container-fluid h-100 m-0 d-flex flex-column justify-content-end">
	<div class="row row-cols-2">
		{#each games as game}
			<div class="col">
				<div class="card">
					<div class="card-header fw-bold d-flex justify-content-between">
						<div>
							{fmt(game.startsAt)} - {fmt(game.endsAt)}
						</div>
						<div>Free</div>
					</div>

					<div class="card-body p-1 overflow-hidden">
						<img src={game.image} class="card-img" alt={game.title} />
					</div>

					<div class="card-arrow">
						<div class="card-arrow-top-left" />
						<div class="card-arrow-top-right" />
						<div class="card-arrow-bottom-left" />
						<div class="card-arrow-bottom-right" />
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>

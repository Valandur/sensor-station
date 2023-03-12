<script lang="ts">
	import { getContextClient, queryStore } from '@urql/svelte';

	import { GET_GAMES, type GetGames } from '$lib/models/games';
	import { format, parseISO } from 'date-fns';

	export let params: string = '';
	params; // svelte hack to disable unused variable warning

	$: store = queryStore<GetGames>({
		query: GET_GAMES,
		context: { additionalTypenames: ['Game'] },
		requestPolicy: 'cache-and-network',
		client: getContextClient()
	});

	$: games = $store.data?.games.freeEpic || [];
</script>

<div class="container-fluid h-100 m-0 d-flex flex-column justify-content-end">
	<div class="row row-cols-2">
		{#each games as game}
			<div class="col">
				<div class="card">
					<div class="card-header fw-bold">
						{format(parseISO(game.startsAt), 'dd MMM')} - {format(parseISO(game.endsAt), 'dd MMM')}
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

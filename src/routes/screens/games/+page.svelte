<script lang="ts">
	import { format } from 'date-fns';
	import de from 'date-fns/locale/de/index';
	import { goto } from '$app/navigation';

	import { swipe } from '$lib/swipe';
	import EmptyCard from '$lib/components/EmptyCard.svelte';

	import type { PageData } from './$types';

	export let data: PageData;
	$: games = data.games;
	$: prevPage = data.prevPage;
	$: nextPage = data.nextPage;
</script>

<div
	class="h-100 d-flex flex-column justify-content-end"
	use:swipe={{ y: 100 }}
	on:swipe={(e) => goto(e.detail.dir === 'up' ? nextPage : prevPage)}
>
	{#if games.length > 0}
		<div class="row row-cols-2">
			{#each games as game}
				<div class="col">
					<div class="card">
						<div class="card-header fw-bold d-flex justify-content-between">
							<div>
								{format(game.startsAt, 'dd MMM')} - {game.endsAt
									? format(game.endsAt, 'dd MMM', { locale: de })
									: ''}
							</div>
							<div>
								{#if game.pct === 0}
									Free
								{:else}
									{game.pct}%
								{/if}
							</div>
						</div>

						<div class="card-body p-1 overflow-hidden">
							<img src={`/data/games/${game.image}`} class="card-img" alt={game.title} />

							<div class="card-img-overlay d-flex flex-column justify-content-end p-1 z-2">
								<div class="bg-black bg-opacity-75 fw-bold text-white px-1">{game.title}</div>
							</div>
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
	{:else}
		<EmptyCard>Es wurden keine Spiele gefunden</EmptyCard>
	{/if}
</div>

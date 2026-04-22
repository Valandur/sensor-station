<script lang="ts">
	import { formatInTimeZone } from 'date-fns-tz';
	import { de } from 'date-fns/locale';
	import { page } from '$app/state';

	import { tz } from '$lib/stores/tz';
	import { getGames } from '$lib/epic-games.remote';
	import EmptyCard from '$lib/components/empty-card.svelte';

	import ErrorCard from '../error-card.svelte';
	import Loader from '../loader.svelte';
	import Card from '../card.svelte';

	let { name }: { name: string } = $props();

	let pageNr = $derived.by(() => {
		const pageStr = page.url.searchParams.get('page');
		const pageNr = pageStr ? Number(pageStr) : 0;
		return isFinite(pageNr) ? pageNr : 0;
	});
</script>

{#await getGames({ srv: name, page: pageNr })}
	<Loader />
{:then { games }}
	<div class="row flex-1"></div>

	{#if games.length > 0}
		<div class="row row-cols-2 overflow-auto">
			{#each games as game, i (i)}
				<div class="col">
					<Card type="theme">
						{#snippet header()}
							<div>
								{formatInTimeZone(game.startsAt, $tz, 'dd MMM', { locale: de })} -
								{game.endsAt ? formatInTimeZone(game.endsAt, $tz, 'dd MMM', { locale: de }) : ''}
							</div>
							<div>
								{#if game.pct === 0}
									Free
								{:else}
									{game.pct}%
								{/if}
							</div>
						{/snippet}

						{#snippet body()}
							<div class="p-1">
								<img src={'/' + game.image} class="card-img" alt={game.title} />

								<div class="card-img-overlay d-flex flex-column justify-content-end z-2 p-1">
									<div class="bg-opacity-75 fw-bold bg-black px-1 text-white">{game.title}</div>
								</div>
							</div>
						{/snippet}
					</Card>
				</div>
			{/each}
		</div>
	{:else}
		<EmptyCard>Es wurden keine Spiele gefunden</EmptyCard>
	{/if}
{:catch err}
	<ErrorCard message="Error loading games" params={err} />
{/await}

<script lang="ts">
	import { formatInTimeZone } from 'date-fns-tz';
	import { de } from 'date-fns/locale';

	import { tz } from '$lib/stores/tz';
	import EmptyCard from '$lib/components/EmptyCard.svelte';
	import type { EpicGamesServiceMainData } from '$lib/models/epic-games';

	import Card from '../Card.svelte';

	export let data: EpicGamesServiceMainData;
	$: games = data.games;
</script>

<div class="row flex-1"></div>

{#if games.length > 0}
	<div class="row row-cols-2 overflow-auto">
		{#each games as game}
			<div class="col">
				<Card>
					<svelte:fragment slot="header">
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
					</svelte:fragment>

					<div slot="body" class="p-1">
						<img src={'/' + game.image} class="card-img" alt={game.title} />

						<div class="card-img-overlay d-flex flex-column justify-content-end p-1 z-2">
							<div class="bg-black bg-opacity-75 fw-bold text-white px-1">{game.title}</div>
						</div>
					</div>
				</Card>
			</div>
		{/each}
	</div>
{:else}
	<EmptyCard>Es wurden keine Spiele gefunden</EmptyCard>
{/if}

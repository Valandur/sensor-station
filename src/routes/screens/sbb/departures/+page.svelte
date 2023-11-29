<script lang="ts">
	import { format } from 'date-fns';
	import de from 'date-fns/locale/de/index';
	import { goto } from '$app/navigation';

	import { swipe } from '$lib/swipe';
	import EmptyCard from '$lib/components/EmptyCard.svelte';

	import type { PageData } from './$types';

	export let data: PageData;
	$: departures = data.departures;
	$: prevPage = data.prevPage;
	$: nextPage = data.nextPage;
</script>

<div
	class="h-100 d-flex flex-column justify-content-end"
	use:swipe={{ y: 100 }}
	on:swipe={(e) => goto(e.detail.dir === 'up' ? nextPage : prevPage)}
>
	{#if departures.length > 0}
		{#each departures as departure}
			<div class="row fs-2">
				<div class="col-3">
					{format(departure.scheduled, 'HH:mm', { locale: de })}
					{#if departure.delay > 0}
						<span class="text-red">+{departure.delay}</span>
					{/if}
				</div>
				<div class="col-2">{departure.lineName}</div>
				<div class="col-6">{departure.destination}</div>
			</div>
		{/each}
	{:else}
		<EmptyCard>Es wurden keine Abfahrten gefunden</EmptyCard>
	{/if}
</div>

<script lang="ts">
	import { formatInTimeZone } from 'date-fns-tz';
	import { de } from 'date-fns/locale/de';

	import type { SbbDeparture } from '$lib/models/sbb-departures';
	import { tz } from '$lib/stores/tz';

	import EmptyCard from '../EmptyCard.svelte';

	export let departures: SbbDeparture[];
</script>

<div class="row flex-1"></div>

{#if departures.length > 0}
	{#each departures as departure}
		<div class="row fs-2">
			<div class="col-3">
				{formatInTimeZone(departure.scheduled, $tz, 'HH:mm', { locale: de })}
				{#if departure.delay > 0}
					<span class="text-red">+{departure.delay}</span>
				{/if}
			</div>
			<div class="col-1">
				{#if departure.type === 'rail'}
					<i class="fa-solid fa-train"></i>
				{:else if departure.type === 'tram'}
					<i class="fa-solid fa-train-tram"></i>
				{:else if departure.type === 'bus'}
					<i class="fa-solid fa-bus"></i>
				{:else}
					{departure.type}
				{/if}
			</div>
			<div class="col-2">
				{departure.lineName}
			</div>
			<div class="col">{departure.destination}</div>
		</div>
	{/each}
{:else}
	<EmptyCard>Es wurden keine Abfahrten gefunden</EmptyCard>
{/if}

<script lang="ts">
	import { formatInTimeZone } from 'date-fns-tz';
	import { de } from 'date-fns/locale';

	import EmptyCard from '$lib/components/EmptyCard.svelte';
	import Card from '$lib/components/Card.svelte';
	import type { WeatherAlert, WeatherLocation } from '$lib/models/weather';
	import { tz } from '$lib/stores/tz';

	import Marker from './Marker.svelte';

	export let location: WeatherLocation;
	export let alert: WeatherAlert;
</script>

<Marker {location} />

<div class="row flex-1"></div>

{#if alert}
	<div class="row mh-100 overflow-hidden">
		<div class="col mh-100">
			<Card type="warning">
				<svelte:fragment slot="header">
					<div>
						{alert.tags}
					</div>
					<div>
						<i class="fa-solid fa-calendar"></i>
						{formatInTimeZone(alert.start, $tz, 'dd.MM.yy HH:mm', { locale: de })} -
						{formatInTimeZone(alert.end, $tz, 'dd.MM.yy HH:mm', { locale: de })}
					</div>
				</svelte:fragment>

				<svelte:fragment slot="title">
					{alert.event}
				</svelte:fragment>

				<svelte:fragment slot="subTitle">
					{alert.sender}
				</svelte:fragment>

				<div class="overflow-scroll">
					<ul class="m-0 p-0 ms-3">
						{#each alert.content.split('\n') as line}
							<li>{line.substring(2)}</li>
						{/each}
					</ul>
				</div>
			</Card>
		</div>
	</div>
{:else}
	<EmptyCard>Aktuell sind keine Wetter-Warnungen vorhanden</EmptyCard>
{/if}

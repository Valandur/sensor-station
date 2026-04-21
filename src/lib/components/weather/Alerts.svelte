<script lang="ts">
	import { formatInTimeZone } from 'date-fns-tz';
	import { de } from 'date-fns/locale';

	import { getWeatherAlerts } from '$lib/weather.remote';
	import EmptyCard from '$lib/components/empty-card.svelte';
	import Card from '$lib/components/card.svelte';
	import { tz } from '$lib/stores/tz';

	import Loader from '../loader.svelte';
	import ErrorCard from '../error-card.svelte';
	import Pagination from '../pagination.svelte';

	import Marker from './maker.svelte';

	let { name }: { name: string } = $props();
</script>

{#await getWeatherAlerts({ srv: name })}
	<Loader />
{:then { location, alert, prevPage, nextPage }}
	<Pagination {prevPage} {nextPage}>
		<Marker {location} />

		<div class="row flex-1"></div>

		{#if alert}
			<div class="row mh-100 overflow-auto">
				<div class="col mh-100">
					<Card type="warning">
						{#snippet header()}
							<div>
								{alert.tags}
							</div>
							<div>
								<i class="fa-solid fa-calendar"></i>
								{formatInTimeZone(alert.start, $tz, 'dd.MM.yy HH:mm', { locale: de })} -
								{formatInTimeZone(alert.end, $tz, 'dd.MM.yy HH:mm', { locale: de })}
							</div>
						{/snippet}

						{#snippet title()}
							{alert.event}
						{/snippet}

						{#snippet subTitle()}
							{alert.sender}
						{/snippet}

						<ul class="m-0 ms-3 p-0">
							{#each alert.content.split('\n') as line, i (i)}
								<li>{line.substring(2)}</li>
							{/each}
						</ul>
					</Card>
				</div>
			</div>
		{:else}
			<EmptyCard>Aktuell sind keine Wetter-Warnungen vorhanden</EmptyCard>
		{/if}
	</Pagination>
{:catch err}
	<ErrorCard message="Error loading weather" params={err} />
{/await}

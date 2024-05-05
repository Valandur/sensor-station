<script lang="ts">
	import { format } from 'date-fns';
	import { de } from 'date-fns/locale';

	import { goto } from '$app/navigation';

	import { swipe } from '$lib/swipe';
	import EmptyCard from '$lib/components/EmptyCard.svelte';
	import Card from '$lib/components/Card.svelte';

	import type { PageData } from './$types';

	export let data: PageData;
	$: loc = data.location;
	$: alert = data.alert;
	$: prevPage = data.prevPage;
	$: nextPage = data.nextPage;
</script>

<div
	class="h-100 d-flex flex-column justify-content-end"
	use:swipe={{ y: 100 }}
	on:swipe={(e) => goto(e.detail.dir === 'up' ? nextPage : prevPage)}
>
	<div class="row d-flex flex-row justify-content-end mb-2">
		<div class="col-auto text-muted">
			<i class="icofont-location-pin" />
			{#if loc.place}
				{loc.place.name}, {loc.place.state}, {loc.place.country}
			{:else}
				{loc.lat}, {loc.lng}
			{/if}
		</div>
	</div>

	{#if alert}
		<div class="row mh-100 overflow-hidden">
			<div class="col mh-100">
				<Card type="warning">
					<svelte:fragment slot="header">
						<div>
							{alert.tags}
						</div>
						<div>
							<i class="icofont-calendar" />
							{format(alert.start, 'dd.MM.yy HH:mm', { locale: de })} -
							{format(alert.end, 'dd.MM.yy HH:mm', { locale: de })}
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
</div>

<script lang="ts">
	import { format } from 'date-fns';
	import de from 'date-fns/locale/de/index';

	import { goto } from '$app/navigation';

	import { swipe } from '$lib/swipe';
	import EmptyCard from '$lib/components/EmptyCard.svelte';

	import type { PageData } from './$types';

	export let data: PageData;
	$: loc = data.location;
	$: alert = data.alert;
	$: prevPage = data.prevPage;
	$: nextPage = data.nextPage;
</script>

<div
	class="h-100 d-flex flex-column justify-content-between"
	use:swipe={{ y: 100 }}
	on:swipe={(e) => goto(e.detail.dir === 'up' ? nextPage : prevPage)}
>
	<div class="row d-flex flex-row justify-content-end">
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
				<div class="card bg-warning border-warning bg-opacity-25 h-100">
					<div class="card-header border-warning fw-bold small d-flex justify-content-between">
						<div>
							{alert.tags}
						</div>
						<div>
							<i class="icofont-calendar" />
							{format(alert.start, 'dd.MM.yy HH:mm', { locale: de })} -
							{format(alert.end, 'dd.MM.yy HH:mm', { locale: de })}
						</div>
					</div>
					<div class="card-body overflow-scroll">
						<h5 class="card-title">
							{alert.event}
						</h5>
						<h6 class="card-subtitle mb-2 text-white text-opacity-50">
							{alert.sender}
						</h6>
						<ul class="m-0 p-0 ms-3">
							{#each alert.content.split('\n') as line}
								<li>{line.substring(2)}</li>
							{/each}
						</ul>
					</div>

					<div class="card-arrow">
						<div class="card-arrow-top-left" />
						<div class="card-arrow-top-right" />
						<div class="card-arrow-bottom-left" />
						<div class="card-arrow-bottom-right" />
					</div>
				</div>
			</div>
		</div>
	{:else}
		<EmptyCard>Aktuell sind keine Wetter-Warnungen vorhanden</EmptyCard>
	{/if}
</div>

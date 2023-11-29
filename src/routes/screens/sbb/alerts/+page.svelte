<script lang="ts">
	import { format } from 'date-fns';
	import de from 'date-fns/locale/de/index';
	import { goto } from '$app/navigation';

	import { swipe } from '$lib/swipe';
	import EmptyCard from '$lib/components/EmptyCard.svelte';

	import type { PageData } from './$types';

	export let data: PageData;
	$: alert = data.alert;
	$: prevPage = data.prevPage;
	$: nextPage = data.nextPage;

	$: summary = alert.summary?.replace('Einschränkung', '').trim() || '';
	$: description = alert.description?.replace('Linien', '').trim() || '';
	$: reason = alert.reason?.replace('Grund:', '').trim() || '';
	$: duration =
		alert.duration
			?.replace('Dauer:', '')
			.replaceAll(`${format(new Date(), 'dd.MM.yyyy', { locale: de })},`, '')
			.trim() || '';
</script>

<div
	class="h-100 d-flex flex-column justify-content-end"
	use:swipe={{ y: 100 }}
	on:swipe={(e) => goto(e.detail.dir === 'up' ? nextPage : prevPage)}
>
	{#if alert}
		<div class="row">
			<div class="col">
				<div class="card bg-warning border-warning bg-opacity-25">
					{#if reason || duration}
						<div class="card-header border-warning fw-bold small d-flex justify-content-between">
							<div>
								{reason}
							</div>
							<div>
								<i class="icofont-clock-time" />
								{duration}
							</div>
						</div>
					{/if}
					<div class="card-body">
						{#if summary}
							<h5 class="card-title">
								{summary}
							</h5>
						{/if}
						{#if description}
							<h6 class="card-subtitle mb-2 text-white text-opacity-50">
								{description}
							</h6>
						{/if}
						{#if alert.consequence}
							<p class="card-text">{alert.consequence}</p>
						{/if}
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
		<EmptyCard>Keine Einschränkungen im Betrieb der SBB</EmptyCard>
	{/if}
</div>

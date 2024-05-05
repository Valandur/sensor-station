<script lang="ts">
	import { format } from 'date-fns';
	import { de } from 'date-fns/locale';
	import { goto } from '$app/navigation';

	import { swipe } from '$lib/swipe';
	import EmptyCard from '$lib/components/EmptyCard.svelte';
	import Card from '$lib/components/Card.svelte';

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
				<Card type="warning">
					<svelte:fragment slot="header">
						<div>
							{reason}
						</div>
						<div>
							<i class="icofont-clock-time" />
							{duration}
						</div>
					</svelte:fragment>

					<svelte:fragment slot="title">
						{summary}
					</svelte:fragment>

					<svelte:fragment slot="subTitle">
						{description}
					</svelte:fragment>

					{alert.consequence}
				</Card>
			</div>
		</div>
	{:else}
		<EmptyCard>Keine Einschränkungen im Betrieb der SBB</EmptyCard>
	{/if}
</div>

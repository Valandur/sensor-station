<script lang="ts">
	import { formatInTimeZone } from 'date-fns-tz';
	import { de } from 'date-fns/locale';
	import { isSameDay } from 'date-fns/isSameDay';
	import { page } from '$app/state';

	import EmptyCard from '$lib/components/empty-card.svelte';
	import { tz } from '$lib/stores/tz';
	import { getEvents } from '$lib/calendar.remote';

	import Loader from '../loader.svelte';
	import ErrorCard from '../error-card.svelte';
	import Pagination from '../pagination.svelte';

	let { name }: { name: string } = $props();

	let pageNr = $derived.by(() => {
		const pageStr = page.url.searchParams.get('page');
		const pageNr = pageStr ? Number(pageStr) : 0;
		return isFinite(pageNr) ? pageNr : 0;
	});
</script>

{#await getEvents({ srv: name, page: pageNr })}
	<Loader />
{:then { events, nextPage, prevPage }}
	{@const formattedEvents = events
		?.map((event) => ({ ...event, isSameDay: false, isOdd: false }))
		.map((event, i, arr) => ({
			...event,
			isSameDay: (event.isSameDay = i > 0 && isSameDay(arr[i].tsStart, arr[i - 1].tsStart)),
			isOdd: (event.isOdd = event.isSameDay ? arr[i - 1].isOdd : !arr[i - 1]?.isOdd)
		}))}

	{#if formattedEvents.length > 0}
		<Pagination {prevPage} {nextPage}>
			{#each formattedEvents as event, i (i)}
				<div class="row fs-2" class:same={event.isSameDay} class:odd={event.isOdd}>
					{#if !event.isSameDay}
						<div class="col-1">{formatInTimeZone(event.tsStart, $tz, 'iii', { locale: de })}</div>
						<div class="col-1">{formatInTimeZone(event.tsStart, $tz, 'd.', { locale: de })}</div>
					{:else}
						<div class="col-2"></div>
					{/if}
					{#if event.isWholeDay}
						<div class="col-2">------</div>
					{:else}
						<div class="col-2">
							{formatInTimeZone(event.tsStart, $tz, 'HH:mm', { locale: de })}
						</div>
					{/if}
					<div class="col">{event.content}</div>
				</div>
			{/each}
		</Pagination>
	{:else}
		<EmptyCard>Es wurden keine Kalendereinträge gefunden</EmptyCard>
	{/if}
{:catch err}
	<ErrorCard message="Error loading events" params={err} />
{/await}

<style lang="scss">
	.row {
		&:not(:first-child):not(.same) {
			border-top: 1px dashed var(--bs-gray);
		}

		&.odd {
			color: pink;
		}
	}
</style>

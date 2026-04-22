<script lang="ts">
	import { formatInTimeZone } from 'date-fns-tz';
	import { de } from 'date-fns/locale';
	import { isSameDay } from 'date-fns/isSameDay';

	import EmptyCard from '$lib/components/EmptyCard.svelte';
	import type { CalendarServiceMainData } from '$lib/models/calendar';
	import { tz } from '$lib/stores/tz';

	export let data: CalendarServiceMainData;
	$: events = data.events;
	$: formattedEvents = events?.map((event) => ({ ...event, isSameDay: false, isOdd: false }));
	$: formattedEvents?.forEach((event, i, arr) => {
		event.isSameDay = i > 0 && isSameDay(arr[i].tsStart, arr[i - 1].tsStart);
		event.isOdd = event.isSameDay ? arr[i - 1].isOdd : !arr[i - 1]?.isOdd;
	});
</script>

{#if formattedEvents.length > 0}
	{#each formattedEvents as event}
		<div class="row fs-2" class:same={event.isSameDay} class:odd={event.isOdd}>
			{#if !event.isSameDay}
				<div class="col-1">{formatInTimeZone(event.tsStart, $tz, 'iii', { locale: de })}</div>
				<div class="col-1">{formatInTimeZone(event.tsStart, $tz, 'd.', { locale: de })}</div>
			{:else}
				<div class="col-2" />
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
{:else}
	<EmptyCard>Es wurden keine Kalendereinträge gefunden</EmptyCard>
{/if}

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

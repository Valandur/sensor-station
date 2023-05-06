<script lang="ts">
	import { format, isSameDay } from 'date-fns';
	import de from 'date-fns/locale/de/index';

	import { goto } from '$app/navigation';

	import { swipe } from '$lib/swipe';

	import type { PageData } from './$types';

	export let data: PageData;
	$: prevPage = data.prevPage;
	$: nextPage = data.nextPage;
	$: events = data.events.map((event) => ({ ...event, isSameDay: false, isOdd: false }));
	$: events.forEach((event, i, arr) => {
		event.isSameDay = i > 0 && isSameDay(arr[i].tsStart, arr[i - 1].tsStart);
		event.isOdd = event.isSameDay ? arr[i - 1].isOdd : !arr[i - 1]?.isOdd;
	});
</script>

<div
	class="h-100 d-flex flex-column justify-content-end"
	use:swipe={{ y: 100 }}
	on:swipe={(e) => goto(e.detail.dir === 'up' ? nextPage : prevPage)}
>
	{#each events as event, i}
		<div class="row fs-2" class:same={event.isSameDay} class:odd={event.isOdd}>
			{#if !event.isSameDay}
				<div class="col-1">{format(event.tsStart, 'iii', { locale: de })}</div>
				<div class="col-1">{format(event.tsStart, 'd.', { locale: de })}</div>
			{:else}
				<div class="col-2" />
			{/if}
			{#if event.isWholeDay}
				<div class="col-2">------</div>
			{:else}
				<div class="col-2">{format(event.tsStart, 'HH:mm', { locale: de })}</div>
			{/if}
			<div class="col">{event.content}</div>
		</div>
	{/each}
</div>

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

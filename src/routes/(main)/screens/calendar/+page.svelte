<script lang="ts">
	import { format } from 'date-fns';
	import { goto } from '$app/navigation';
	import de from 'date-fns/locale/de/index';

	import { swipe } from '$lib/swipe';

	import type { PageData } from './$types';

	export let data: PageData;
	$: events = data.events;
</script>

<div
	class="container-fluid m-0 h-100"
	use:swipe={{ y: 100 }}
	on:swipe={(e) => goto(e.detail.dir === 'up' ? data.nextPage : data.prevPage)}
>
	{#each events as event}
		<div class="row">
			<div class="col-1">{format(event.tsStart, 'iii', { locale: de })}</div>
			<div class="col-1">{format(event.tsStart, 'd.', { locale: de })}</div>
			{#if event.isWholeDay}
				<div class="col-2">-------</div>
			{:else}
				<div class="col-2">{format(event.tsStart, 'HH:mm', { locale: de })}</div>
			{/if}
			<div class="col">{event.content}</div>
		</div>
	{/each}
</div>

<style>
	.row {
		font-size: 1.6rem;
	}

	.row:nth-of-type(even) {
		color: pink;
	}
</style>

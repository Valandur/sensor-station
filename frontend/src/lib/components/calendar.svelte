<script lang="ts">
	import { getContextClient, queryStore } from '@urql/svelte';
	import { format, parseISO } from 'date-fns';
	import de from 'date-fns/locale/de/index';

	import { GET_CALENDAR, type GetCalendarData } from '$lib/models/calendar';

	export let params: string = '';
	params; // svelte hack to disable unused variable warning

	$: store = queryStore<GetCalendarData>({
		query: GET_CALENDAR,
		context: { additionalTypenames: ['CalendarEvent'] },
		requestPolicy: 'cache-and-network',
		client: getContextClient()
	});

	$: events = $store.data?.calendar.events || [];
</script>

<div class="container-fluid m-0 h-100">
	{#each events as event}
		<div class="row">
			<div class="col-1">{format(parseISO(event.tsStart), 'iii', { locale: de })}</div>
			<div class="col-1">{format(parseISO(event.tsStart), 'd.')}</div>
			{#if event.isWholeDay}
				<div class="col-2">-------</div>
			{:else}
				<div class="col-2">{format(parseISO(event.tsStart), 'HH:mm')}</div>
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

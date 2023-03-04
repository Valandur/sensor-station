<script lang="ts">
	import { getContextClient, queryStore } from '@urql/svelte';

	import { GET_CALENDAR, type GetCalendarData } from '$lib/models/calendar';
	import { format, parseISO } from 'date-fns';

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

<div class="container">
	{#each events as event}
		<div class="event">
			<div>{format(parseISO(event.tsStart), 'dd.MM')}</div>
			<div>{format(parseISO(event.tsStart), 'HH:mm')}</div>
			<div>{format(parseISO(event.tsEnd), 'HH:mm')}</div>
			<div style:flex="4">{event.content}</div>
		</div>
	{/each}
</div>

<style>
	.container {
		flex: 1;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.event {
		display: flex;
		flex-direction: row;
	}

	.event > div {
		flex: 1;
	}

	.event:nth-of-type(even) {
		color: pink;
	}
</style>

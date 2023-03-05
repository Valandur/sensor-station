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

<div class="container">
	{#each events as event}
		<div class="event">
			<div style:flex="1">{format(parseISO(event.tsStart), 'iii', { locale: de })}</div>
			<div style:flex="1">{format(parseISO(event.tsStart), 'd.')}</div>
			<div style:flex="1.7">{format(parseISO(event.tsStart), 'HH:mm')}</div>
			<div style:flex="5">{event.content}</div>
		</div>
	{/each}
</div>

<style>
	.container {
		flex: 1;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		font-size: 2rem;
	}

	.event {
		display: flex;
		flex-direction: row;
	}

	.event:nth-of-type(even) {
		color: pink;
	}
</style>

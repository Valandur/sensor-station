<script lang="ts">
	import { getContextClient, queryStore } from '@urql/svelte';

	import { GET_CALENDAR, type GetCalendarData } from '$lib/models/calendar';

	export let params: string = '';
	params; // svelte hack to disable unused variable warning

	$: store = queryStore<GetCalendarData>({
		query: GET_CALENDAR,
		context: { additionalTypenames: ['CalendarEvent'] },
		client: getContextClient()
	});

	$: events = $store.data?.events || [];
</script>

<div class="container">
	{#each events as event}
		<div>
			<div class="text">{event.description}</div>
		</div>
	{/each}
</div>

<style>
	.container {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		overflow: hidden;
	}

	.text {
		text-align: center;
		font-size: 1rem;
	}
</style>

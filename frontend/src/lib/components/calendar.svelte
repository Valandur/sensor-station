<script lang="ts" context="module">
	const QUERY = gql`
		query Calendar {
			...CalendarEvents
		}
		${CALENDAR_EVENTS}
	`;

	export const calendarMeta: ComponentMeta<CalendarEvent[]> = {
		getData: async () => {
			const client = getClient();
			const res = await client
				.query<CalendarEvents>(
					QUERY,
					{},
					{
						additionalTypenames: ['CalendarEvent'],
						requestPolicy: 'cache-and-network'
					}
				)
				.toPromise();
			if (res.error) {
				throw res.error;
			}
			if (!res.data) {
				throw new Error('Could not get data for calendar');
			}
			return res.data.calendar.events || [];
		}
	};
</script>

<script lang="ts">
	import { gql } from '@urql/svelte';
	import { format, parseISO } from 'date-fns';
	import de from 'date-fns/locale/de/index';

	import { CALENDAR_EVENTS, type CalendarEvents, type CalendarEvent } from '$lib/models/calendar';
	import { getClient } from '$lib/client';
	import type { ComponentMeta } from '$lib/component';

	export let params: string = '';
	params; // svelte hack to disable unused variable warning
	export let data: CalendarEvent[];
</script>

<div class="container-fluid m-0 h-100">
	{#each data as event}
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

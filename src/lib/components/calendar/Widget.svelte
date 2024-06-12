<script lang="ts">
	import type { CalendarWidgetData } from '$lib/models/calendar';

	import ErrorCard from '../ErrorCard.svelte';
	import PageLayout from '../PageLayout.svelte';
	import WidgetConfig from './WidgetConfig.svelte';
	import Events from './Events.svelte';

	export let name: string;
	export let data: CalendarWidgetData | null;
	export let form: Record<string, any> | null;
	export let isEmbedded: boolean;
</script>

{#if isEmbedded}
	{#if data && !data.action}
		<Events events={data.events} />
	{:else}
		<ErrorCard title="Calendar" message="Missing data or invalid action" params={{ name }} />
	{/if}
{:else}
	<PageLayout title="Calendar" subTitle={name} closeUrl="/widgets">
		{#if data}
			{#if !data.action}
				<Events events={data.events} />
			{:else if data.action === 'config'}
				{#if form?.message}
					<ErrorCard message={form.message} />
				{:else if form?.success}
					<div class="alert alert-success m-0">Config saved!</div>
				{/if}
				<WidgetConfig {name} {data} />
			{:else}
				<ErrorCard title="Calendar" message="Unknown action" params={{ name, data }} />
			{/if}
		{:else}
			<ErrorCard title="Calendar" message="Missing data" params={{ name }} />
		{/if}
	</PageLayout>
{/if}

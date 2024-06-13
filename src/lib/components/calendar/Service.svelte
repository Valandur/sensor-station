<script lang="ts">
	import type { CalendarServiceData } from '$lib/models/calendar';

	import ErrorCard from '../ErrorCard.svelte';
	import PageLayout from '../PageLayout.svelte';
	import Events from './Events.svelte';
	import ServiceConfig from './ServiceConfig.svelte';

	export let name: string;
	export let data: CalendarServiceData | null;
	export let form: Record<string, any> | null;
	export let isEmbedded: boolean = false;
</script>

<PageLayout title="Calendar" subTitle={name} closeUrl="/services" show={!isEmbedded}>
	{#if data}
		{#if data.type === 'data'}
			<Events events={data.events} />
		{:else if data.type === 'config'}
			{#if form?.message}
				<ErrorCard message={form.message} />
			{:else if form?.success}
				<div class="alert alert-success m-0">Config saved!</div>
			{/if}
			<ServiceConfig {name} {data} />
		{:else}
			<ErrorCard title="Calendar" message="Unknown action" params={{ name, data }} />
		{/if}
	{:else}
		<ErrorCard title="Calendar" message="Missing data" params={{ name }} />
	{/if}
</PageLayout>

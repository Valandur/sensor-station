<script lang="ts">
	import type { SbbDeparturesWidgetData } from '$lib/models/sbb-departures';

	import ErrorCard from '../ErrorCard.svelte';
	import PageLayout from '../PageLayout.svelte';
	import WidgetConfig from './WidgetConfig.svelte';
	import Departures from './Departures.svelte';

	export let name: string;
	export let data: SbbDeparturesWidgetData | null;
	export let form: Record<string, any> | null;
	export let isEmbedded: boolean;
</script>

<PageLayout title="SBB Departures" subTitle={name} closeUrl="/widgets" show={!isEmbedded}>
	{#if data}
		{#if !data.action}
			<Departures departures={data.departures} />
		{:else if data.action === 'config'}
			{#if form?.message}
				<ErrorCard message={form.message} />
			{:else if form?.success}
				<div class="alert alert-success m-0">Config saved!</div>
			{/if}
			<WidgetConfig {name} {data} />
		{:else}
			<ErrorCard title="SBB Departures" message="Unknown action" params={{ name, data }} />
		{/if}
	{:else}
		<ErrorCard title="SBB Departures" message="Missing data" params={{ name }} />
	{/if}
</PageLayout>

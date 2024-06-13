<script lang="ts">
	import type { SbbDeparturesServiceData } from '$lib/models/sbb-departures';

	import ErrorCard from '../ErrorCard.svelte';
	import PageLayout from '../PageLayout.svelte';
	import ServiceConfig from './ServiceConfig.svelte';
	import Departures from './Departures.svelte';

	export let name: string;
	export let data: SbbDeparturesServiceData | null;
	export let form: Record<string, any> | null;
	export let isEmbedded: boolean = false;
</script>

<PageLayout title="SBB Departures" subTitle={name} closeUrl="/services" show={!isEmbedded}>
	{#if data}
		{#if data.type === 'data'}
			<Departures departures={data.departures} />
		{:else if data.type === 'config'}
			{#if form?.message}
				<ErrorCard message={form.message} />
			{:else if form?.success}
				<div class="alert alert-success m-0">Config saved!</div>
			{/if}
			<ServiceConfig {name} {data} />
		{:else}
			<ErrorCard title="SBB Departures" message="Unknown action" params={{ name, data }} />
		{/if}
	{:else}
		<ErrorCard title="SBB Departures" message="Missing data" params={{ name }} />
	{/if}
</PageLayout>

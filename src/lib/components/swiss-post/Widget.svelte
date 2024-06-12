<script lang="ts">
	import type { SwissPostWidgetData } from '$lib/models/swiss-post';

	import ErrorCard from '../ErrorCard.svelte';
	import PageLayout from '../PageLayout.svelte';
	import WidgetConfig from './WidgetConfig.svelte';
	import Shipment from './Shipment.svelte';

	export let name: string;
	export let data: SwissPostWidgetData | null;
	export let form: Record<string, any> | null;
	export let isEmbedded: boolean;
</script>

<PageLayout title="Swiss Post" subTitle={name} closeUrl="/widgets" show={!isEmbedded}>
	{#if data}
		{#if !data.action}
			<Shipment shipment={data.shipment} />
		{:else if data.action === 'config'}
			{#if form?.message}
				<ErrorCard message={form.message} />
			{:else if form?.success}
				<div class="alert alert-success m-0">Config saved!</div>
			{/if}
			<WidgetConfig {name} {data} />
		{:else}
			<ErrorCard title="Swiss Post" message="Unknown action" params={{ name, data }} />
		{/if}
	{:else}
		<ErrorCard title="Swiss Post" message="Missing data" params={{ name }} />
	{/if}
</PageLayout>

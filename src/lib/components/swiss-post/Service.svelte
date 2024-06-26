<script lang="ts">
	import type { SwissPostServiceData } from '$lib/models/swiss-post';

	import ErrorCard from '../ErrorCard.svelte';
	import PageLayout from '../PageLayout.svelte';
	import Pagination from '../Pagination.svelte';
	import ServiceConfig from './ServiceConfig.svelte';
	import Shipment from './Shipment.svelte';

	export let name: string;
	export let data: SwissPostServiceData | null;
	export let form: Record<string, any> | null;
	export let isEmbedded: boolean = false;
</script>

<PageLayout title="Swiss Post" subTitle={name} closeUrl="/services" show={!isEmbedded}>
	{#if data}
		{#if data.type === 'data'}
			<Pagination prevPage={data.prevPage} nextPage={data.nextPage}>
				<Shipment shipment={data.shipment} />
			</Pagination>
		{:else if data.type === 'config'}
			{#if form?.message}
				<ErrorCard message={form.message} />
			{:else if form?.success}
				<div class="alert alert-success m-0">Config saved!</div>
			{/if}
			<ServiceConfig {name} {data} />
		{:else}
			<ErrorCard title="Swiss Post" message="Unknown action" params={{ name, data }} />
		{/if}
	{:else}
		<ErrorCard title="Swiss Post" message="Missing data" params={{ name }} />
	{/if}
</PageLayout>

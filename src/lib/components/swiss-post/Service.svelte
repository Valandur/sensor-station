<script lang="ts">
	import type { SwissPostServiceData } from '$lib/models/swiss-post';

	import ErrorCard from '../ErrorCard.svelte';
	import PageLayout from '../PageLayout.svelte';
	import Pagination from '../Pagination.svelte';
	import FormFeedback from '../FormFeedback.svelte';
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
				<Shipment {data} />
			</Pagination>
		{:else if data.type === 'config'}
			<FormFeedback {form} />
			<ServiceConfig {data} />
		{:else}
			<ErrorCard title="Swiss Post" message="Unknown action" params={{ name, data }} />
		{/if}
	{:else}
		<ErrorCard title="Swiss Post" message="Missing data" params={{ name }} />
	{/if}
</PageLayout>

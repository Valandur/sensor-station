<script lang="ts">
	import type { SbbDeparturesServiceData } from '$lib/models/sbb-departures';

	import ErrorCard from '../ErrorCard.svelte';
	import PageLayout from '../PageLayout.svelte';
	import Pagination from '../Pagination.svelte';
	import FormFeedback from '../FormFeedback.svelte';
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
			<Pagination prevPage={data.prevPage} nextPage={data.nextPage}>
				<Departures departures={data.departures} />
			</Pagination>
		{:else if data.type === 'config'}
			<FormFeedback {form} />
			<ServiceConfig {name} {data} />
		{:else}
			<ErrorCard title="SBB Departures" message="Unknown action" params={{ name, data }} />
		{/if}
	{:else}
		<ErrorCard title="SBB Departures" message="Missing data" params={{ name }} />
	{/if}
</PageLayout>

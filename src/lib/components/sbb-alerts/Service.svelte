<script lang="ts">
	import type { SbbAlertsServiceData } from '$lib/models/sbb-alerts';

	import ErrorCard from '../ErrorCard.svelte';
	import PageLayout from '../PageLayout.svelte';
	import Pagination from '../Pagination.svelte';
	import FormFeedback from '../FormFeedback.svelte';
	import ServiceConfig from './ServiceConfig.svelte';
	import Alert from './Alert.svelte';

	export let name: string;
	export let data: SbbAlertsServiceData | null;
	export let form: Record<string, any> | null;
	export let isEmbedded: boolean = false;
</script>

<PageLayout title="SBB Alerts" subTitle={name} closeUrl="/services" show={!isEmbedded}>
	{#if data}
		{#if data.type === 'data'}
			<Pagination prevPage={data.prevPage} nextPage={data.nextPage}>
				<Alert alert={data.alert} />
			</Pagination>
		{:else if data.type === 'config'}
			<FormFeedback {form} />
			<ServiceConfig {name} {data} />
		{:else}
			<ErrorCard title="SBB Alerts" message="Unknown action" params={{ name, data }} />
		{/if}
	{:else}
		<ErrorCard title="SBB Alerts" message="Missing data" params={{ name }} />
	{/if}
</PageLayout>

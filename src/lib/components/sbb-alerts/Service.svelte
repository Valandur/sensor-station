<script lang="ts">
	import type { SbbAlertsServiceData } from '$lib/models/sbb-alerts';

	import ErrorCard from '../ErrorCard.svelte';
	import PageLayout from '../PageLayout.svelte';
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
			<Alert alert={data.alert} />
		{:else if data.type === 'config'}
			{#if form?.message}
				<ErrorCard message={form.message} />
			{:else if form?.success}
				<div class="alert alert-success m-0">Config saved!</div>
			{/if}
			<ServiceConfig {name} {data} />
		{:else}
			<ErrorCard title="SBB Alerts" message="Unknown action" params={{ name, data }} />
		{/if}
	{:else}
		<ErrorCard title="SBB Alerts" message="Missing data" params={{ name }} />
	{/if}
</PageLayout>

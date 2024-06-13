<script lang="ts">
	import type { SbbAlertsServiceData } from '$lib/models/sbb-alerts';

	import ErrorCard from '../ErrorCard.svelte';
	import PageLayout from '../PageLayout.svelte';
	import ServiceConfig from './ServiceConfig.svelte';
	import Alert from './Alert.svelte';

	export let name: string;
	export let data: SbbAlertsServiceData | null;
	export let form: Record<string, any> | null;
</script>

<PageLayout title="Swiss Post" subTitle={name} closeUrl="/services">
	{#if data}
		{#if !data.action}
			<Alert alert={data.alerts[0]} />
		{:else if data.action === 'config'}
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

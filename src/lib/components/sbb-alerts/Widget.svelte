<script lang="ts">
	import type { SbbAlertsWidgetData } from '$lib/models/sbb-alerts';

	import ErrorCard from '../ErrorCard.svelte';
	import PageLayout from '../PageLayout.svelte';
	import WidgetConfig from './WidgetConfig.svelte';
	import Alert from './Alert.svelte';

	export let name: string;
	export let data: SbbAlertsWidgetData | null;
	export let form: Record<string, any> | null;
	export let isEmbedded: boolean;
</script>

<PageLayout title="SBB Departures" subTitle={name} closeUrl="/widgets" show={!isEmbedded}>
	{#if data}
		{#if !data.action}
			<Alert alert={data.alert} />
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

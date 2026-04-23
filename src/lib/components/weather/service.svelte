<script lang="ts">
	import type { ServiceComponentProps } from '$lib/models/service';

	import ErrorCard from '../error-card.svelte';
	import PageLayout from '../page-layout.svelte';

	import ServiceConfig from './config.svelte';
	import Daily from './daily.svelte';
	import Hourly from './hourly.svelte';
	import Alerts from './alerts.svelte';

	let { name, action, isEmbedded = false }: ServiceComponentProps = $props();
</script>

<PageLayout title="Weather" subTitle={name} closeUrl="/services" show={!isEmbedded}>
	{#if action === 'hourly'}
		<Hourly {name} />
	{:else if action === 'daily'}
		<Daily {name} />
	{:else if action === 'alerts'}
		<Alerts {name} />
	{:else if action === 'config'}
		<ServiceConfig {name} />
	{:else}
		<ErrorCard title="Weather" message="Unknown action" params={{ name, action }} />
	{/if}
</PageLayout>

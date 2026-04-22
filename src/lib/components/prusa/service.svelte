<script lang="ts">
	import type { ServiceComponentProps } from '$lib/models/service';

	import ErrorCard from '../error-card.svelte';
	import PageLayout from '../page-layout.svelte';

	import ServiceConfig from './service-config.svelte';
	import Printer from './printer.svelte';

	let { name, action, isEmbedded }: ServiceComponentProps = $props();
</script>

<PageLayout title="Prusa" subTitle={name} closeUrl="/services" show={!isEmbedded}>
	{#if action === 'main'}
		<Printer {name} />
	{:else if action === 'config'}
		<ServiceConfig {name} />
	{:else}
		<ErrorCard title="Prusa" message="Unknown action" params={{ name, action }} />
	{/if}
</PageLayout>

<script lang="ts">
	import type { ServiceComponentProps } from '$lib/models/service';

	import ErrorCard from '../error-card.svelte';
	import PageLayout from '../page-layout.svelte';

	import ServiceConfig from './service-config.svelte';
	import Events from './events.svelte';

	let { name, action, isEmbedded }: ServiceComponentProps = $props();
</script>

<PageLayout title="Calendar" subTitle={name} closeUrl="/services" show={!isEmbedded}>
	{#if action === 'main'}
		<Events {name} />
	{:else if action === 'config'}
		<ServiceConfig {name} />
	{:else}
		<ErrorCard title="Calendar" message="Unknown action" params={{ name, action }} />
	{/if}
</PageLayout>

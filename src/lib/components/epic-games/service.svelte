<script lang="ts">
	import type { ServiceComponentProps } from '$lib/models/service';

	import ErrorCard from '../error-card.svelte';
	import PageLayout from '../page-layout.svelte';

	import ServiceConfig from './service-config.svelte';
	import Games from './games.svelte';

	let { name, action, isEmbedded }: ServiceComponentProps = $props();
</script>

<PageLayout title="Epic Games" subTitle={name} closeUrl="/services" show={!isEmbedded}>
	{#if action === 'main'}
		<Games {name} />
	{:else if action === 'config'}
		<ServiceConfig {name} />
	{:else}
		<ErrorCard title="Epic Games" message="Unknown action" params={{ name, action }} />
	{/if}
</PageLayout>

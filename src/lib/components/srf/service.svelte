<script lang="ts">
	import type { ServiceComponentProps } from '$lib/models/service';

	import ErrorCard from '../error-card.svelte';
	import PageLayout from '../page-layout.svelte';

	import ServiceConfig from './service-config.svelte';
	import News from './news.svelte';
	import Details from './details.svelte';

	let { name, action, isEmbedded }: ServiceComponentProps = $props();
</script>

<PageLayout
	title="SRF"
	subTitle={name}
	closeUrl="/services"
	show={!isEmbedded && action !== 'details'}
>
	{#if action === 'main'}
		<News {name} />
	{:else if action === 'details'}
		<Details {name} />
	{:else if action === 'config'}
		<ServiceConfig {name} />
	{:else}
		<ErrorCard title="SRF" message="Unknown action" params={{ name, action }} />
	{/if}
</PageLayout>

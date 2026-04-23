<script lang="ts">
	import type { ServiceComponentProps } from '$lib/models/service';

	import ErrorCard from '../error-card.svelte';
	import PageLayout from '../page-layout.svelte';

	import ServiceConfig from './config.svelte';
	import Carousel from './carousel.svelte';

	let { name, action, isEmbedded }: ServiceComponentProps = $props();
</script>

<PageLayout
	title="Carousel"
	subTitle={name}
	closeUrl="/services"
	show={!isEmbedded && action !== 'main'}
>
	{#if action === 'main'}
		<Carousel {name} />
	{:else if action === 'config'}
		<ServiceConfig {name} />
	{:else}
		<ErrorCard title="Carousel" message="Unknown action" params={{ name, action }} />
	{/if}
</PageLayout>

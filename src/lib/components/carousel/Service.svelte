<script lang="ts">
	import type { CarouselServiceData } from '$lib/models/carousel';

	import ErrorCard from '../ErrorCard.svelte';
	import PageLayout from '../PageLayout.svelte';
	import FormFeedback from '../FormFeedback.svelte';
	import ServiceConfig from './ServiceConfig.svelte';
	import Carousel from './Carousel.svelte';

	export let name: string;
	export let action: string;
	export let data: CarouselServiceData | null;
	export let form: Record<string, any> | null;
	export let isEmbedded: boolean = false;
</script>

<PageLayout
	title="Carousel"
	subTitle={name}
	closeUrl="/services"
	show={!isEmbedded && action !== 'main'}
>
	{#if data}
		{#if data.type === 'data'}
			<Carousel {data} />
		{:else if data.type === 'config'}
			<FormFeedback {form} showSuccess={false} />
			<ServiceConfig {name} {data} />
		{:else}
			<ErrorCard title="Carousel" message="Unknown action" params={{ name, data }} />
		{/if}
	{:else}
		<ErrorCard title="Carousel" message="Missing data" params={{ name }} />
	{/if}
</PageLayout>

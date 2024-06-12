<script lang="ts">
	import type { CarouselServiceData } from '$lib/models/carousel';

	import ErrorCard from '../ErrorCard.svelte';
	import PageLayout from '../PageLayout.svelte';
	import ServiceConfig from './ServiceConfig.svelte';
	import Carousel from './Carousel.svelte';

	export let name: string;
	export let data: CarouselServiceData | null;
	export let form: Record<string, any> | null;
</script>

{#if data?.action === 'live'}
	<Carousel {data} />
{:else}
	<PageLayout title="Carousel" subTitle={name} closeUrl="/services">
		{#if data}
			{#if !data.action}
				<Carousel {data} />
			{:else if data.action === 'config'}
				{#if form?.message}
					<ErrorCard message={form.message} />
				{/if}
				<ServiceConfig {name} {data} />
			{:else}
				<ErrorCard title="Carousel" message="Unknown action" params={{ name, data }} />
			{/if}
		{:else}
			<ErrorCard title="Carousel" message="Missing data" params={{ name }} />
		{/if}
	</PageLayout>
{/if}

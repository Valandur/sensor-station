<script lang="ts">
	import type { GalleryServiceData } from '$lib/models/gallery';

	import ErrorCard from '../ErrorCard.svelte';
	import PageLayout from '../PageLayout.svelte';
	import Pagination from '../Pagination.svelte';
	import FormFeedback from '../FormFeedback.svelte';
	import ServiceConfig from './ServiceConfig.svelte';
	import Gallery from './Gallery.svelte';

	export let name: string;
	export let data: GalleryServiceData | null;
	export let form: Record<string, any> | null;
	export let isEmbedded: boolean = false;
</script>

<PageLayout title="Gallery" subTitle={name} closeUrl="/services" show={!isEmbedded}>
	{#if data}
		{#if data.type === 'data'}
			<Pagination prevPage={data.prevPage} nextPage={data.nextPage}>
				<Gallery image={data.image} />
			</Pagination>
		{:else if data.type === 'config'}
			<FormFeedback {form} showSuccess={false} />
			<ServiceConfig {name} {data} />
		{:else}
			<ErrorCard title="Gallery" message="Unknown action" params={{ name, data }} />
		{/if}
	{:else}
		<ErrorCard title="Gallery" message="Missing data" params={{ name }} />
	{/if}
</PageLayout>

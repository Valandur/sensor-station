<script lang="ts">
	import type { GalleryServiceData } from '$lib/models/gallery';

	import ErrorCard from '../ErrorCard.svelte';
	import PageLayout from '../PageLayout.svelte';
	import ServiceConfig from './ServiceConfig.svelte';
	import Gallery from './Gallery.svelte';

	export let name: string;
	export let data: GalleryServiceData | null;
	export let form: Record<string, any> | null;
</script>

<PageLayout title="Gallery" subTitle={name} closeUrl="/services">
	{#if data}
		{#if !data.action}
			<Gallery image={data.images[0]} />
		{:else if data.action === 'config'}
			{#if form?.message}
				<ErrorCard message={form.message} />
			{/if}
			<ServiceConfig {name} {data} />
		{:else}
			<ErrorCard title="Gallery" message="Unknown action" params={{ name, data }} />
		{/if}
	{:else}
		<ErrorCard title="Gallery" message="Missing data" params={{ name }} />
	{/if}
</PageLayout>

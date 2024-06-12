<script lang="ts">
	import type { GalleryWidgetData } from '$lib/models/gallery';

	import ErrorCard from '../ErrorCard.svelte';
	import PageLayout from '../PageLayout.svelte';
	import WidgetConfig from './WidgetConfig.svelte';
	import Gallery from './Gallery.svelte';

	export let name: string;
	export let data: GalleryWidgetData | null;
	export let form: Record<string, any> | null;
	export let isEmbedded: boolean;
</script>

{#if isEmbedded}
	{#if data && !data.action}
		<Gallery image={data.image} />
	{:else}
		<ErrorCard title="Gallery" message="Missing data or invalid action" params={{ name }} />
	{/if}
{:else}
	<PageLayout title="Gallery" subTitle={name} closeUrl="/widgets">
		{#if data}
			{#if !data.action}
				<Gallery image={data.image} />
			{:else if data.action === 'config'}
				{#if form?.message}
					<ErrorCard message={form.message} />
				{:else if form?.success}
					<div class="alert alert-success m-0">Config saved!</div>
				{/if}
				<WidgetConfig {name} {data} />
			{:else}
				<ErrorCard title="Gallery" message="Unknown action" params={{ name, data }} />
			{/if}
		{:else}
			<ErrorCard title="Gallery" message="Missing data" params={{ name }} />
		{/if}
	</PageLayout>
{/if}

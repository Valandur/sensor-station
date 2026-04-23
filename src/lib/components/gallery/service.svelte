<script lang="ts">
	import type { ServiceComponentProps } from '$lib/models/service';

	import ErrorCard from '../error-card.svelte';
	import PageLayout from '../page-layout.svelte';

	import Config from './config.svelte';
	import Gallery from './gallery.svelte';

	let { name, action, isEmbedded }: ServiceComponentProps = $props();
</script>

<PageLayout title="Gallery" subTitle={name} closeUrl="/services" show={!isEmbedded}>
	{#if action === 'main'}
		<Gallery {name} />
	{:else if action === 'config'}
		<Config {name} />
	{:else}
		<ErrorCard title="Gallery" message="Unknown action" params={{ name, action }} />
	{/if}
</PageLayout>

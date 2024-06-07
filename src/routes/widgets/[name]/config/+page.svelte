<script lang="ts">
	import ErrorCard from '$lib/components/ErrorCard.svelte';
	import PageLayout from '$lib/components/PageLayout.svelte';
	import { WIDGETS } from '$lib/widgets';

	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;
	$: comps = WIDGETS[data.type];
</script>

<PageLayout title={data.name + ' [' + data.type + ']'} closeUrl="/widgets">
	{#if form?.message}
		<ErrorCard message={form.message} />
	{:else if form?.success}
		<div class="alert alert-success m-0">Config saved!</div>
	{/if}
	<svelte:component
		this={comps.config}
		name={data.name}
		config={data.config}
		services={data.services}
	/>
</PageLayout>

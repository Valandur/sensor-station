<script lang="ts">
	import ErrorCard from '$lib/components/ErrorCard.svelte';
	import PageLayout from '$lib/components/PageLayout.svelte';
	import { SERVICES } from '$lib/services';

	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;
	$: comps = SERVICES[data.type];
</script>

<PageLayout title={data.name + ' [' + data.type + ']'} closeUrl="/services">
	{#if form?.message}
		<ErrorCard message={form.message} />
	{:else if form?.success}
		<div class="alert alert-success m-0">Config saved!</div>
	{/if}
	<svelte:component this={comps.config} name={data.name} config={data.config} />
</PageLayout>

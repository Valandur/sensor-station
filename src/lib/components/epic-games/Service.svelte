<script lang="ts">
	import type { EpicGamesServiceData } from '$lib/models/epic-games';

	import ErrorCard from '../ErrorCard.svelte';
	import PageLayout from '../PageLayout.svelte';
	import ServiceConfig from './ServiceConfig.svelte';
	import Games from './Games.svelte';

	export let name: string;
	export let data: EpicGamesServiceData | null;
	export let form: Record<string, any> | null;
	export let isEmbedded: boolean = false;
</script>

<PageLayout title="Epic Games" subTitle={name} closeUrl="/services" show={!isEmbedded}>
	{#if data}
		{#if data.type === 'data'}
			<Games games={data.games} />
		{:else if data.type === 'config'}
			{#if form?.message}
				<ErrorCard message={form.message} />
			{:else if form?.success}
				<div class="alert alert-success m-0">Config saved!</div>
			{/if}
			<ServiceConfig {name} {data} />
		{:else}
			<ErrorCard title="Epic Games" message="Unknown action" params={{ name, data }} />
		{/if}
	{:else}
		<ErrorCard title="Epic Games" message="Missing data" params={{ name }} />
	{/if}
</PageLayout>

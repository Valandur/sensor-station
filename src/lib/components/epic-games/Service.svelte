<script lang="ts">
	import type { EpicGamesServiceData } from '$lib/models/epic-games';

	import ErrorCard from '../ErrorCard.svelte';
	import PageLayout from '../PageLayout.svelte';
	import Games from './Games.svelte';

	export let name: string;
	export let data: EpicGamesServiceData | null;
	export let form: Record<string, any> | null;
</script>

<PageLayout title="Epic Games" subTitle={name} closeUrl="/services">
	{#if data}
		{#if !data.action}
			<Games games={data.games} />
		{:else}
			<ErrorCard title="Epic Games" message="Unknown action" params={{ name, data }} />
		{/if}
	{:else}
		<ErrorCard title="Epic Games" message="Missing data" params={{ name }} />
	{/if}
</PageLayout>

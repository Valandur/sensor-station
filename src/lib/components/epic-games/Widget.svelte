<script lang="ts">
	import type { EpicGamesWidgetData } from '$lib/models/epic-games';

	import ErrorCard from '../ErrorCard.svelte';
	import PageLayout from '../PageLayout.svelte';
	import Games from './Games.svelte';
	import WidgetConfig from './WidgetConfig.svelte';

	export let name: string;
	export let data: EpicGamesWidgetData | null;
	export let form: Record<string, any> | null;
	export let isEmbedded: boolean;
</script>

<PageLayout title="Calendar" subTitle={name} closeUrl="/widgets" show={!isEmbedded}>
	{#if data}
		{#if !data.action}
			<Games games={data.games} />
		{:else if data.action === 'config'}
			{#if form?.message}
				<ErrorCard message={form.message} />
			{:else if form?.success}
				<div class="alert alert-success m-0">Config saved!</div>
			{/if}
			<WidgetConfig {name} {data} />
		{:else}
			<ErrorCard title="Calendar" message="Unknown action" params={{ name, data }} />
		{/if}
	{:else}
		<ErrorCard title="Calendar" message="Missing data" params={{ name }} />
	{/if}
</PageLayout>

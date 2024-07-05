<script lang="ts">
	import type { EpicGamesServiceData } from '$lib/models/epic-games';

	import ErrorCard from '../ErrorCard.svelte';
	import PageLayout from '../PageLayout.svelte';
	import Pagination from '../Pagination.svelte';
	import FormFeedback from '../FormFeedback.svelte';
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
			<Pagination prevPage={data.prevPage} nextPage={data.nextPage}>
				<Games {data} />
			</Pagination>
		{:else if data.type === 'config'}
			<FormFeedback {form} />
			<ServiceConfig {data} />
		{:else}
			<ErrorCard title="Epic Games" message="Unknown action" params={{ name, data }} />
		{/if}
	{:else}
		<ErrorCard title="Epic Games" message="Missing data" params={{ name }} />
	{/if}
</PageLayout>

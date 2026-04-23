<script lang="ts">
	import { page } from '$app/state';
	import { getDetails } from '$lib/srf.remote';

	import ErrorCard from '../error-card.svelte';

	import Loader from '../loader.svelte';

	let { name }: { name: string } = $props();

	let articleId = $derived(page.url.searchParams.get('article') ?? '');
	let details = $derived(getDetails({ srv: name, articleId }));
</script>

<svelte:head>
	{#if details.current?.simple === false}
		{#if details.current?.head}
			{@html details.current.head}
		{/if}
	{/if}
</svelte:head>

<svelte:boundary>
	{@const { body } = await details}

	<div class="main overflow-scroll">
		{@html body}
	</div>

	{#snippet pending()}
		<Loader />
	{/snippet}

	{#snippet failed(error)}
		<ErrorCard message="Error loading articles" params={{ error }} />
	{/snippet}
</svelte:boundary>

<style lang="scss">
	:global(html),
	:global(body) {
		margin: 0;
		padding: 0;
		font-size: 32px;
	}

	.main {
		padding: 0.5em;
	}
</style>

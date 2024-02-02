<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	$: simple = data.simple;
	$: head = data.article.head;
	$: body = data.article.body;
</script>

<svelte:head>
	{#if !simple}
		<base href="https://www.srf.ch/" />
		{@html head}
	{/if}
</svelte:head>

<div class="main">
	{@html body}
</div>

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

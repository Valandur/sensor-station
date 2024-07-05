<script lang="ts">
	import type { SrfServiceDetailsData } from '$lib/models/srf';

	export let data: SrfServiceDetailsData;
	$: simple = data.simple;
	$: head = data.head;
	$: body = data.body;
</script>

<svelte:head>
	{#if !simple}
		<base href="https://www.srf.ch/" />
		{@html head}
	{/if}
</svelte:head>

<div class="main overflow-scroll">
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

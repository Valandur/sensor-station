<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	$: simple = data.simple;
</script>

<svelte:head>
	<base href="https://www.srf.ch/" />
	{@html data.head}
</svelte:head>

{#if simple}
	<div class="mb-5">&nbsp;</div>
	<div class="mb-5">&nbsp;</div>
	<div class="mb-5">&nbsp;</div>
{/if}

{@html data.main}

{@html data.scripts}

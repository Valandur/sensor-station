<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<base href="https://www.srf.ch/" />
	{@html data.head}
</svelte:head>

{@html data.main}

{@html data.scripts}

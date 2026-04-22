<script lang="ts">
	import { getDetails } from '$lib/srf.remote';

	import Loader from '../loader.svelte';

	let { name }: { name: string } = $props();
</script>

{#await getDetails({ srv: name, articleId: '06f9e7ecc1f33d46' })}
	<Loader />
{:then { body }}
	<div class="main overflow-scroll">Done</div>
{/await}

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

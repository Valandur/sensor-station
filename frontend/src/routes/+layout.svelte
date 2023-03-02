<script lang="ts">
	import { setContextClient } from '@urql/svelte';

	import { getClient } from '$lib/client';

	const client = getClient();
	setContextClient(client);
</script>

<slot />

<style>
	:global(html),
	:global(body) {
		background-color: black;
		color: orange;
		font-size: 30px;
		font-family: Roboto, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		margin: 0;
		padding: 0;
	}

	:global(.input),
	:global(.select),
	:global(.btn) {
		color: orange;
		font-size: 1rem;
		border: 1px solid orange;
		background-color: black;
		padding: 0.2rem;
	}
</style>

<script lang="ts">
	import { createClient, setContextClient } from '@urql/svelte';

	const client = createClient({
		url: 'http://localhost:2000/graphql',
		fetchOptions: { credentials: 'include' }
	});
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
	:global(.btn) {
		color: orange;
		font-size: 1rem;
		border: 1px solid orange;
		background-color: black;
		padding: 0.2rem;
	}
</style>

<script lang="ts">
	import { setContextClient } from '@urql/svelte';

	import { getClient } from '$lib/client';

	import '../theme/scss/styles.scss';
	import '../theme/scss/font.scss';

	const client = getClient();
	setContextClient(client);
</script>

<slot />

<style>
	:global(html),
	:global(body) {
		overflow: hidden;
		font-size: 30px;
	}
</style>

<script lang="ts">
	import { onMount } from 'svelte';
	import { setContextClient } from '@urql/svelte';

	import { getClient } from '$lib/client';

	import 'pace-js/themes/black/pace-theme-flash.css';

	import '$lib/theme/scss/styles.scss';
	import '$lib/theme/scss/font.scss';

	const client = getClient();
	setContextClient(client);

	onMount(() => {
		document.body.classList.add('app-init');
		return () => document.body.classList.remove('app-init');
	});
</script>

<slot />

<style>
	:global(html),
	:global(body) {
		font-size: 30px;
		overflow: hidden;
		overscroll-behavior: none;
	}

	:global(option) {
		background-color: var(--bs-dark);
	}
</style>

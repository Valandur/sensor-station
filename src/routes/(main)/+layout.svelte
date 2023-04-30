<script lang="ts">
	import { onMount } from 'svelte';

	import '$lib/theme/scss/styles.scss';
	import '$lib/theme/scss/font.scss';

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
</style>

<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import type { Snippet } from 'svelte';

	import { swipe } from '$lib/swipe';
	import { restart } from '$lib/screen.svelte';

	let { nextPage, prevPage, children }: { nextPage: number; prevPage: number; children?: Snippet } =
		$props();

	function onSwipe(pageNr: number) {
		restart();
		const url = new URL(page.url);
		url.searchParams.set('page', `${pageNr}`);
		// eslint-disable-next-line svelte/no-navigation-without-resolve
		goto(url);
	}
</script>

<div
	style="display: contents;"
	use:swipe={{ y: 100 }}
	onswipe={(e) => onSwipe(e.detail.dir === 'up' ? nextPage : prevPage)}
>
	{@render children?.()}
</div>

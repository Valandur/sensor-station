<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	import { swipe } from '$lib/swipe';
	import { restart } from '$lib/stores/screen';

	export let nextPage: number;
	export let prevPage: number;

	function onSwipe(page: number) {
		restart();
		const url = new URL($page.url);
		url.searchParams.set('page', `${page}`);
		goto(url);
	}
</script>

<div
	style="display: contents;"
	use:swipe={{ y: 100 }}
	on:swipe={(e) => onSwipe(e.detail.dir === 'up' ? nextPage : prevPage)}
>
	<slot />
</div>

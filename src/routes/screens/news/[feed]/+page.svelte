<script lang="ts">
	import { fade } from 'svelte/transition';
	import { formatDistanceToNow } from 'date-fns';
	import de from 'date-fns/locale/de/index';

	import { goto } from '$app/navigation';

	import { paused } from '$lib/stores/screen';
	import { swipe } from '$lib/swipe';
	import type { NewsFeedItem } from '$lib/models/NewsFeedItem';

	import type { PageData } from './$types';

	export let data: PageData;
	$: feedId = data.feedId;
	$: items = data.items;
	$: prevPage = data.prevPage;
	$: nextPage = data.nextPage;

	let wasPaused = false;
	let selectedItem: NewsFeedItem | null = null;

	function select(item: NewsFeedItem | null) {
		selectedItem = item;
		if (item) {
			wasPaused = $paused;
			paused.set(true);
		} else {
			paused.set(wasPaused);
		}
	}
</script>

<div
	class="h-100 d-flex flex-column"
	use:swipe={{ y: 100 }}
	on:swipe={(e) => goto(e.detail.dir === 'up' ? nextPage : prevPage)}
>
	{#if selectedItem}
		<div class="details" transition:fade={{ duration: 500 }}>
			<iframe title="Story" src={`/screens/news/${feedId}/${selectedItem.id}`} />
			<button class="btn btn-sm btn-danger" on:click={() => select(null)}>
				<i class="icofont-ui-close" />
			</button>
		</div>
	{/if}

	{#each items as item}
		<div class="row mt-1 flex-1" on:click={() => select(item)} on:keypress={() => select(item)}>
			<div class="col-3 me-1 image">
				<img alt="Thumbnail" src={`/data/news/${item.image}`} />
			</div>
			<div class="col abstract d-flex flex-column justify-content-around">
				<div class="fs-3">{item.title}</div>
				<div class="fs-5 text-muted">
					{formatDistanceToNow(item.ts, { locale: de, addSuffix: true })}
				</div>
			</div>
		</div>
	{/each}
</div>

<style lang="scss">
	.abstract {
		font-size: 1.4rem;
		line-height: 1.4rem;
	}

	iframe {
		width: 100%;
		height: 100%;
		border: 1px solid gray;
	}

	.details {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		padding: 8px;
		background-color: rgba(var(--bs-white-rgb), 0.2);
		z-index: 1000;

		.btn {
			position: absolute;
			top: 16px;
			right: 16px;
		}
	}

	.image {
		position: relative;
		overflow: hidden;

		img {
			position: absolute;
			max-width: 100%;
		}
	}
</style>

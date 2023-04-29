<script lang="ts">
	import { fade } from 'svelte/transition';
	import { goto } from '$app/navigation';

	import { swipe } from '$lib/swipe';
	import type { NewsFeedItem } from '$lib/models/NewsFeedItem';

	import type { PageData } from './$types';

	export let data: PageData;
	$: items = data.items;

	let selectedItem: NewsFeedItem | null = null;

	function select(item: NewsFeedItem | null) {
		selectedItem = item;
	}
</script>

<div
	class="container-fluid h-100 m-0 d-flex flex-column"
	use:swipe={{ y: 100 }}
	on:swipe={(e) => goto(e.detail.dir === 'up' ? data.nextPage : data.prevPage)}
>
	{#if selectedItem}
		<div class="details" transition:fade={{ duration: 500 }}>
			<iframe title="Story" src={`/screens/news/${data.feedId}/${selectedItem.link}`} />
			<button class="btn btn-sm btn-danger" on:click={() => select(null)}>
				<i class="icofont-ui-close" />
			</button>
		</div>
	{/if}

	{#each items as item}
		<div class="row mb-1 flex-1" on:click={() => select(item)} on:keypress={() => select(item)}>
			<div class="col-3 me-1 image">
				<img alt="Thumbnail" src={item.img} />
			</div>
			<div class="col p-1 abstract">{item.title}</div>
		</div>
	{/each}
</div>

<style>
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
	}

	.image {
		position: relative;
		overflow: hidden;
	}

	img {
		position: absolute;
		max-width: 100%;
	}

	.btn {
		position: absolute;
		top: 16px;
		left: 16px;
	}
</style>

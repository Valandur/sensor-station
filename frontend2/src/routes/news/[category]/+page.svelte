<script lang="ts">
	import { getContextClient, queryStore } from '@urql/svelte';

	import { BASE_URL } from '$lib/client';
	import { GET_NEWS, type GetNewsData, type NewsItem } from '$lib/models/news';
	import { getIndexStore } from '$lib/stores/news';

	import type { PageData } from './$types';

	export let data: PageData;

	const MAX_ITEMS = 3;

	$: store = queryStore<GetNewsData>({
		query: GET_NEWS,
		client: getContextClient(),
		variables: { feed: data.category }
	});

	let selectedItem: NewsItem | null = null;

	$: rawNews = $store.data?.news || [];
	$: index = getIndexStore(data.category);
	$: newsIdx = ($index < 0 ? rawNews.length : 0) + ($index % rawNews.length);
	$: news = [
		...rawNews.slice(newsIdx, newsIdx + MAX_ITEMS),
		...rawNews.slice(0, Math.max(MAX_ITEMS - (rawNews.length - newsIdx), 0))
	];

	let startY = 0;
	const touchStart = (e: TouchEvent) => {
		startY = e.changedTouches[0].clientY;
	};
	const touchEnd = (e: TouchEvent) => {
		const diff = e.changedTouches[0].clientY - startY;
		if (diff < -100) {
			index.increment();
		} else if (diff > 100) {
			index.decrement();
		}
	};
</script>

<div class="container" on:touchstart={touchStart} on:touchend={touchEnd}>
	{#if selectedItem}
		<div class="details">
			<iframe title="Story" src={BASE_URL + selectedItem.link} />
			<button class="close" on:click={() => (selectedItem = null)}>❌</button>
		</div>
	{:else}
		{#each news as item}
			<div
				class="item"
				on:click={() => (selectedItem = item)}
				on:keypress={() => (selectedItem = item)}
			>
				<img class="image" alt="Thumbnail" src={item.img} />
				<div class="abstract">{item.title}</div>
			</div>
		{/each}
	{/if}
</div>

<style>
	.container {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		overflow: hidden;
	}

	.item {
		flex: 1;
		display: flex;
		flex-direction: row;
		align-items: center;
		overflow: hidden;
		margin-top: 10px;
	}

	img.image {
		height: 100%;
		margin-right: 10px;
	}

	.abstract {
		flex: 4;
		font-size: 38px;
		line-height: 1.1em;
	}

	iframe {
		width: 100%;
		height: 100%;
		border-width: 1px;
		border-style: solid;
		border-color: gray;
	}

	.details {
		position: absolute;
		top: 10px;
		left: 10px;
		right: 10px;
		bottom: 10px;
	}

	button.close {
		position: absolute;
		top: 10px;
		left: 10px;
		font-size: 40px;
	}
</style>

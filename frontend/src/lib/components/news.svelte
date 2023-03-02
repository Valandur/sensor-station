<script lang="ts">
	import { getContextClient, queryStore } from '@urql/svelte';
	import { onDestroy } from 'svelte';

	import { getIndexStore } from '$lib/stores/news';
	import { screen } from '$lib/stores/screen';

	import { BASE_URL } from '$lib/client';
	import { GET_NEWS, type GetNewsData, type NewsItem } from '$lib/models/news';

	export let params: string = '';

	const MAX_ITEMS = 3;

	$: store = queryStore<GetNewsData>({
		query: GET_NEWS,
		variables: { feed: params },
		context: { additionalTypenames: ['NewsItem'] },
		client: getContextClient()
	});

	let selectedItem: NewsItem | null = null;

	$: rawNews = $store.data?.news || [];
	$: index = getIndexStore(params);
	$: newsIdx = ($index < 0 ? rawNews.length : 0) + ($index % rawNews.length);
	$: news = [
		...rawNews.slice(newsIdx, newsIdx + MAX_ITEMS),
		...rawNews.slice(0, Math.max(MAX_ITEMS - (rawNews.length - newsIdx), 0))
	];

	onDestroy(async () => {
		index.increment();
	});

	let startY = 0;
	const touchStart = (e: TouchEvent) => {
		startY = e.changedTouches[0].clientY;
	};
	const touchEnd = (e: TouchEvent) => {
		const diff = e.changedTouches[0].clientY - startY;
		if (diff < -100) {
			index.increment();
			screen.reset();
		} else if (diff > 100) {
			index.decrement();
			screen.reset();
		}
	};

	const select = (item: NewsItem | null) => {
		selectedItem = item;
		if (item) {
			screen.stop();
		} else {
			screen.start();
		}
	};
</script>

<div class="container" on:touchstart={touchStart} on:touchend={touchEnd}>
	{#if selectedItem}
		<div class="details">
			<iframe title="Story" src={BASE_URL + selectedItem.link} />
			<button class="close" on:click={() => select(null)}>❌</button>
		</div>
	{:else}
		{#each news as item}
			<div class="item" on:click={() => select(item)} on:keypress={() => select(item)}>
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
		margin-top: 0.5rem;
	}

	img.image {
		height: 100%;
		margin-right: 0.5rem;
	}

	.abstract {
		flex: 4;
		font-size: 1.2rem;
		line-height: 1.2rem;
	}

	iframe {
		width: 100%;
		height: 100%;
		border: 1px solid gray;
	}

	.details {
		position: absolute;
		top: 8px;
		left: 8px;
		right: 8px;
		bottom: 8px;
	}

	button.close {
		position: absolute;
		top: 8px;
		left: 8px;
		font-size: 1rem;
	}
</style>

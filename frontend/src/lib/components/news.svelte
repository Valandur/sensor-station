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
		requestPolicy: 'cache-and-network',
		client: getContextClient()
	});

	let selectedItem: NewsItem | null = null;

	$: rawNews = $store.data?.news.items || [];
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

<div class="container m-0" on:touchstart={touchStart} on:touchend={touchEnd}>
	{#if selectedItem}
		<div class="details">
			<iframe title="Story" src={BASE_URL + `/news/${params}/${selectedItem.id}`} />
			<button class="btn btn-theme" on:click={() => select(null)}
				><i class="icofont-ui-close" /></button
			>
		</div>
	{:else}
		{#each news as item}
			<div class="row" on:click={() => select(item)} on:keypress={() => select(item)}>
				<img class="col-3" alt="Thumbnail" src={item.img} />
				<div class="col abstract p-1">{item.title}</div>
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

	.abstract {
		font-size: 1.5rem;
		line-height: 1.5rem;
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

	.btn {
		position: absolute;
		top: 8px;
		left: 8px;
		font-size: 1rem;
	}
</style>

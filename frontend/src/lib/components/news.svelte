<script lang="ts">
	import { onDestroy } from 'svelte';
	import { getContextClient, queryStore } from '@urql/svelte';

	import { getStore } from '$lib/stores/counter';
	import { screen } from '$lib/stores/screen';

	import { BASE_URL } from '$lib/client';
	import { GET_NEWS, type GetNewsData, type NewsItem } from '$lib/models/news';

	export let params: string = '';

	const MAX_ITEMS = 3;
	const DEFAULT = '1646';

	$: feed = params || DEFAULT;
	$: store = queryStore<GetNewsData>({
		query: GET_NEWS,
		variables: { feed },
		context: { additionalTypenames: ['NewsItem'] },
		requestPolicy: 'cache-and-network',
		client: getContextClient()
	});

	let selectedItem: NewsItem | null = null;

	$: rawNews = $store.data?.news.items || [];
	$: index = getStore('news_' + feed, rawNews.length);
	$: news = [
		...rawNews.slice($index, $index + MAX_ITEMS),
		...rawNews.slice(0, Math.max(MAX_ITEMS - (rawNews.length - $index), 0))
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

<div
	class="container-fluid h-100 m-0 d-flex flex-column"
	on:touchstart={touchStart}
	on:touchend={touchEnd}
>
	{#if selectedItem}
		<div class="details">
			<iframe title="Story" src={BASE_URL + `/news/${params}/${selectedItem.id}`} />
			<button class="btn btn-sm btn-theme" on:click={() => select(null)}
				><i class="icofont-ui-close" /></button
			>
		</div>
	{:else}
		{#each news as item}
			<div class="row mb-1 flex-1" on:click={() => select(item)} on:keypress={() => select(item)}>
				<div class="col-3 me-1 image">
					<img alt="Thumbnail" src={item.img} />
				</div>
				<div class="col p-1 abstract">{item.title}</div>
			</div>
		{/each}
	{/if}
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
		top: 8px;
		left: 8px;
		right: 8px;
		bottom: 8px;
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
		top: 8px;
		left: 8px;
	}
</style>

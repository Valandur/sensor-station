<script lang="ts" context="module">
	const DEFAULT = '1646';

	export const newsMeta: ComponentMeta<News> = {
		getData: async (params = DEFAULT) => {
			const client = getClient();
			const res = await client
				.query<GetNewsData>(
					GET_NEWS,
					{ feed: params },
					{
						additionalTypenames: ['NewsItem'],
						requestPolicy: 'cache-and-network'
					}
				)
				.toPromise();
			if (res.error) {
				throw res.error;
			}
			if (!res.data) {
				throw new Error('Could not get data for news');
			}
			return res.data.news;
		}
	};
</script>

<script lang="ts">
	import { onDestroy } from 'svelte';

	import { getStore } from '$lib/stores/counter';
	import { screen } from '$lib/stores/screen';

	import { BASE_URL, getClient } from '$lib/client';
	import { GET_NEWS, type GetNewsData, type News, type NewsItem } from '$lib/models/news';
	import type { ComponentMeta } from '$lib/component';

	export let params: string = '';
	export let data: News;

	const MAX_ITEMS = 3;

	$: feed = params || DEFAULT;
	let selectedItem: NewsItem | null = null;

	$: rawNews = data.items || [];
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

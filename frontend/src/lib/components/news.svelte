<script lang="ts" context="module">
	const QUERY = gql`
		query News($feed: String!) {
			...NewsItems
		}
		${NEWS_ITEMS}
	`;

	const DEFAULT = '1646';

	export const newsMeta: ComponentMeta<NewsItem[]> = {
		getData: async (params = DEFAULT) => {
			const client = getClient();
			const res = await client
				.query<NewsItems>(
					QUERY,
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
			return res.data.news.items || [];
		}
	};
</script>

<script lang="ts">
	import { gql } from '@urql/svelte';
	import { onDestroy } from 'svelte';

	import { BASE_URL, getClient } from '$lib/client';
	import { fade } from 'svelte/transition';
	import { getStore } from '$lib/stores/counter';
	import { NEWS_ITEMS, type NewsItems, type NewsItem } from '$lib/models/news';
	import { screen } from '$lib/stores/screen';
	import { swipe } from '$lib/swipe';
	import type { ComponentMeta } from '$lib/component';

	export let params: string = '';
	export let data: NewsItem[];

	const MAX_ITEMS = 3;

	$: feed = params || DEFAULT;
	let selectedItem: NewsItem | null = null;

	$: index = getStore('news-' + feed, data.length);
	$: news = [
		...data.slice($index, $index + MAX_ITEMS),
		...data.slice(0, Math.max(MAX_ITEMS - (data.length - $index), 0))
	];

	onDestroy(async () => {
		index.increment();
	});

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
	use:swipe={{ y: 100 }}
	on:swipe={(e) => {
		screen.reset();
		e.detail.dir === 'up' ? index.increment() : index.decrement();
	}}
>
	{#if selectedItem}
		<div class="details" transition:fade={{ duration: 500 }}>
			<iframe title="Story" src={BASE_URL + `/news/${params}/${selectedItem.id}`} />
			<button class="btn btn-sm btn-danger" on:click={() => select(null)}>
				<i class="icofont-ui-close" />
			</button>
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
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		padding: 8px;
		background-color: rgba(var(--bs-white-rgb), 0.2);
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

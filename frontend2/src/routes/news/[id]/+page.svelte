<script lang="ts">
	import type { NewsItem } from '$lib/models/news';
	import type { PageData } from './$types';

	export let data: PageData;

	const MAX_ITEMS = 3;

	const url = data.url;

	let idx = 0;
	let selectedItem: NewsItem | null = null;

	$: newsIdx = (idx < 0 ? data.news.length : 0) + (idx % data.news.length);
	$: news = [
		...data.news.slice(newsIdx, newsIdx + MAX_ITEMS),
		...data.news.slice(0, Math.max(MAX_ITEMS - (data.news.length - newsIdx), 0))
	];

	let startY = 0;
	const touchStart = (e: TouchEvent) => {
		startY = e.changedTouches[0].clientY;
	};
	const touchEnd = (e: TouchEvent) => {
		const diff = e.changedTouches[0].clientY - startY;
		if (diff < -100) {
			idx++;
		} else if (diff > 100) {
			idx--;
		}
	};
</script>

<div class="container" on:touchstart={touchStart} on:touchend={touchEnd}>
	{#if selectedItem}
		<div class="details">
			<iframe title="Story" src={url + selectedItem.link} />
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

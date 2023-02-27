<script lang="ts">
	import { getContextClient, queryStore } from '@urql/svelte';
	import { format, parseISO } from 'date-fns';
	import de from 'date-fns/locale/de/index';

	import { BASE_URL } from '$lib/client';
	import { index } from '$lib/stores/uploads';
	import { type GetUploadsData, GET_UPLOADS } from '$lib/models/upload';

	$: store = queryStore<GetUploadsData>({ query: GET_UPLOADS, client: getContextClient() });

	$: uploads = $store.data?.uploads || [];
	$: uploadIdx = ($index < 0 ? uploads.length : 0) + ($index % uploads.length);
	$: item = uploads[uploadIdx];

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

{#if item}
	<div class="container" on:touchstart={touchStart} on:touchend={touchEnd}>
		<img class:full={item.ratio < 1} src={BASE_URL + item.img} alt="Upload" />

		<div class="title" style="max-width: {item.ratio < 1 ? '40%' : undefined}">
			<div>
				{#each item.title.split('\n') as line}
					{line}
					<br />
				{/each}
			</div>
			<div>{format(parseISO(item.ts), 'dd. MMM yyyy', { locale: de })}</div>
		</div>
	</div>
{/if}

<style>
	.container {
		flex: 1;
		display: flex;
		flex-direction: row;
		overflow: hidden;
	}

	img {
		height: auto;
		max-height: 100%;
		width: auto;
		max-width: 70%;
	}

	img.full {
		position: absolute;
		box-sizing: border-box;
		top: 0;
		right: 0;
		bottom: 0;
		padding: 20px;
		background-color: black;
		text-align: right;
		max-height: 100%;
		max-width: 100%;
	}

	.title {
		flex: 1;
		font-size: 30px;
		margin-left: 10px;
		display: flex;
		flex-direction: column;
	}

	.title > div:first-child {
		flex: 1;
	}

	.title > div:last-child {
		margin-bottom: 4px;
	}
</style>

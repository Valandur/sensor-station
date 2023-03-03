<script lang="ts">
	import { getContextClient, queryStore } from '@urql/svelte';
	import { format, parseISO } from 'date-fns';
	import de from 'date-fns/locale/de/index';
	import { onDestroy } from 'svelte';

	import { index } from '$lib/stores/uploads';
	import { screen } from '$lib/stores/screen';

	import { BASE_URL } from '$lib/client';
	import { type GetUploadsData, GET_UPLOADS } from '$lib/models/upload';

	export let params: string = '';
	params; // svelte hack to disable unused variable warning

	$: store = queryStore<GetUploadsData>({
		query: GET_UPLOADS,
		context: { additionalTypenames: ['UploadItem'] },
		requestPolicy: 'cache-and-network',
		client: getContextClient()
	});

	$: uploads = $store.data?.uploads || [];
	$: uploadIdx = ($index < 0 ? uploads.length : 0) + ($index % uploads.length);
	$: item = uploads[uploadIdx];

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
		font-size: 1rem;
		margin-left: 0.5rem;
		display: flex;
		flex-direction: column;
	}

	.title > div:first-child {
		flex: 1;
	}

	.title > div:last-child {
		margin-bottom: 0.1rem;
	}
</style>

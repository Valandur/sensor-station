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

	$: uploads = $store.data?.uploads.items || [];
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
	<div class="container m-0 d-flex h-100" on:touchstart={touchStart} on:touchend={touchEnd}>
		<img
			class:full={item.ratio < 1}
			class="bg-gray-700 bg-opacity-75"
			src={BASE_URL + item.img}
			alt="Upload"
		/>

		<div
			class="col p-1 d-flex flex-column justify-content-between"
			style:max-width={item.ratio < 1 ? '48%' : undefined}
		>
			<div class="row">
				<div class="col">
					{#each item.title.split('\n') as line}
						{line}
						<br />
					{/each}
				</div>
			</div>

			<div class="row">
				<div class="rol">{format(parseISO(item.ts), 'dd. MMM yyyy', { locale: de })}</div>
			</div>
		</div>
	</div>
{/if}

<style>
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
		text-align: right;
		max-height: 100%;
		max-width: 100%;
	}
</style>

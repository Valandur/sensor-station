<script lang="ts" context="module">
	export const uploadsMeta: ComponentMeta<Uploads> = {
		getData: async () => {
			const client = getClient();
			const res = await client
				.query<GetUploadsData>(
					GET_UPLOADS,
					{},
					{ additionalTypenames: ['UploadItem'], requestPolicy: 'cache-and-network' }
				)
				.toPromise();
			if (res.error) {
				throw res.error;
			}
			if (!res.data) {
				throw new Error('Could not get data for uploads');
			}
			return res.data.uploads;
		}
	};
</script>

<script lang="ts">
	import { onDestroy } from 'svelte';
	import { format, parseISO } from 'date-fns';
	import de from 'date-fns/locale/de/index';

	import { getStore } from '$lib/stores/counter';
	import { screen } from '$lib/stores/screen';

	import { BASE_URL, getClient } from '$lib/client';
	import { type GetUploadsData, GET_UPLOADS, type Uploads } from '$lib/models/upload';
	import type { ComponentMeta } from '$lib/component';

	export let params: string = '';
	params; // svelte hack to disable unused variable warning
	export let data: Uploads;

	$: uploads = data.items || [];
	$: index = getStore('uploads', uploads.length);
	$: item = uploads[$index];

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
	<div
		class="container-fluid m-0 h-100 d-flex justify-content-between"
		on:touchstart={touchStart}
		on:touchend={touchEnd}
	>
		<div class="m-0 p-0 image-container" class:full={item.ratio < 1} class:m-1={item.ratio < 1}>
			{#if item.img.endsWith('.mp4')}
				<video src={BASE_URL + '/data/server/uploads/' + item.img} autoplay muted loop />
			{:else}
				<img src={BASE_URL + '/data/server/uploads/' + item.img} alt="Upload" />
			{/if}
		</div>

		<div
			class="col d-flex flex-column justify-content-between description"
			class:ps-2={item.ratio >= 1}
			class:text-end={item.ratio >= 1}
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

<style lang="scss">
	.image-container {
		min-width: 50%;

		img,
		video {
			max-height: 100%;
			max-width: 100%;
		}

		&.full {
			position: fixed;
			top: 0;
			right: 0;
			bottom: 0;
			background-image: linear-gradient(to left, rgba(var(--bs-dark-rgb), 1) 50%, transparent);

			> img,
			video {
				position: absolute;
				right: 0;
			}
		}
	}

	.description {
		max-width: 45%;
	}
</style>

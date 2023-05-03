<script lang="ts">
	import { format } from 'date-fns';
	import { goto } from '$app/navigation';
	import de from 'date-fns/locale/de/index';

	import { swipe } from '$lib/swipe';

	import type { PageData } from './$types';

	export let data: PageData;
	$: upload = data.upload;
</script>

<div
	class="container-fluid h-100 m-0 d-flex flex-column justify-content-end"
	use:swipe={{ y: 100 }}
	on:swipe={(e) => goto(e.detail.dir === 'up' ? data.nextPage : data.prevPage)}
>
	{#if upload}
		<div class="row h-100">
			<div
				class="col mh-100 image-container"
				class:full={upload.ratio < 1}
				class:m-1={upload.ratio < 1}
			>
				{#if upload.img.endsWith('.mp4')}
					<video src={'/data/uploads/' + upload.img} autoplay muted loop />
				{:else}
					<img src={'/data/uploads/' + upload.img} alt="Upload" />
				{/if}
			</div>

			<div
				class="col d-flex flex-column justify-content-between description"
				class:ps-2={upload.ratio >= 1}
				class:text-end={upload.ratio >= 1}
			>
				<div class="row">
					<div class="col">
						{#each upload.title.split('\n') as line}
							{line}
							<br />
						{/each}
					</div>
				</div>

				<div class="row">
					<div class="rol">{format(upload.ts, 'dd. MMM yyyy', { locale: de })}</div>
				</div>
			</div>
		</div>
	{:else}
		<div class="row mb-5">
			<div class="col" />
			<div class="col-6">
				<div class="card bg-success border-success bg-opacity-25">
					<div class="card-body">
						<h5 class="card-title mb-0">Es wurden noch keine Bilder hochgeladen</h5>
					</div>

					<div class="card-arrow">
						<div class="card-arrow-top-left" />
						<div class="card-arrow-top-right" />
						<div class="card-arrow-bottom-left" />
						<div class="card-arrow-bottom-right" />
					</div>
				</div>
			</div>
			<div class="col" />
		</div>
	{/if}
</div>

<style lang="scss">
	.image-container {
		max-width: 55%;

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
			background-image: linear-gradient(to left, rgba(var(--bs-dark-rgb), 1) 60%, transparent);

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

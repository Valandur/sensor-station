<script lang="ts">
	import { de } from 'date-fns/locale';

	import type { GalleryImage } from '$lib/models/gallery';
	import EmptyCard from '$lib/components/EmptyCard.svelte';
	import { formatInTimeZone } from 'date-fns-tz';
	import { tz } from '$lib/stores/tz';

	export let image: GalleryImage;
</script>

<div class="h-100 d-flex flex-column justify-content-end">
	{#if image}
		<div class="row align-items-end" class:h-100={image.ratio < 1}>
			<div
				class="col mh-100 image-container"
				class:full={image.ratio < 1}
				class:m-1={image.ratio < 1}
			>
				{#if image.img.endsWith('.mp4')}
					<video src={'/data/gallery/' + image.img} autoplay muted loop />
				{:else}
					<img src={'/data/gallery/' + image.img} alt="Upload" />
				{/if}
			</div>

			<div
				class="col mh-100 align-self-stretch d-flex flex-column justify-content-between description"
				class:ps-2={image.ratio >= 1}
				class:text-end={image.ratio >= 1}
			>
				<div class="row">
					<div class="col">
						{#each image.title.split('\n') as line}
							{line}
							<br />
						{/each}
					</div>
				</div>

				<div class="row">
					<div class="rol">
						{formatInTimeZone(image.ts, $tz, 'dd. MMM yyyy', { locale: de })}
					</div>
				</div>
			</div>
		</div>
	{:else}
		<EmptyCard>Es wurden noch keine Bilder hochgeladen</EmptyCard>
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

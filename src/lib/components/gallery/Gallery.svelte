<script lang="ts">
	import { de } from 'date-fns/locale';
	import { formatInTimeZone } from 'date-fns-tz';

	import type { GalleryImage } from '$lib/models/gallery';
	import EmptyCard from '$lib/components/EmptyCard.svelte';
	import { tz } from '$lib/stores/tz';

	export let image: GalleryImage;

	$: isVideo = image && image.img.endsWith('.mp4');
</script>

{#if image}
	{#if image.ratio > 1}
		<div class="row h-100">
			<div class="col h-100 d-flex flex-column align-items-start justify-content-end">
				{#if isVideo}
					<video
						src={'/' + image.img}
						autoplay
						muted
						loop
						class="mh-100 mw-100"
						style="object-fit: contain"
					/>
				{:else}
					<img
						src={'/' + image.img}
						alt={image.title}
						class="mh-100 mw-100"
						style="object-fit: contain"
					/>
				{/if}
			</div>
			<div
				class="col-4 mh-100 align-self-stretch d-flex flex-column justify-content-between text-end"
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
		<div
			class="position-fixed top-0 bottom-0 end-0 w-50 p-1 bg d-flex flex-row justify-content-end"
		>
			{#if isVideo}
				<video
					src={'/' + image.img}
					autoplay
					muted
					loop
					class="mh-100 mw-100"
					style="object-fit: contain"
				/>
			{:else}
				<img
					src={'/' + image.img}
					alt={image.title}
					class="h-100 mw-0"
					style="object-fit: contain"
				/>
			{/if}
		</div>
		<div class="row h-100">
			<div class="col-4 mh-100 align-self-stretch d-flex flex-column justify-content-between">
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
	{/if}
{:else}
	<EmptyCard>Es wurden noch keine Bilder hochgeladen</EmptyCard>
{/if}

<style lang="scss">
	.bg {
		background-image: linear-gradient(to left, rgba(var(--bs-dark-rgb), 1) 60%, transparent);
	}
</style>

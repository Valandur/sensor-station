<script lang="ts">
	import { format } from 'date-fns';
	import { goto } from '$app/navigation';
	import de from 'date-fns/locale/de/index';

	import { swipe } from '$lib/swipe';
	import EmptyCard from '$lib/components/EmptyCard.svelte';

	import type { PageData } from './$types';

	export let data: PageData;
	$: upload = data.upload;
	$: prevPage = data.prevPage;
	$: nextPage = data.nextPage;
</script>

<div
	class="h-100 d-flex flex-column justify-content-end"
	use:swipe={{ y: 100 }}
	on:swipe={(e) => goto(e.detail.dir === 'up' ? nextPage : prevPage)}
>
	{#if upload}
		<div class="row align-items-end" class:h-100={upload.ratio < 1}>
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
				class="col mh-100 align-self-stretch d-flex flex-column justify-content-between description"
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

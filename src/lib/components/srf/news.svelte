<script lang="ts">
	import { fade } from 'svelte/transition';
	import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
	import { de } from 'date-fns/locale/de';
	import { page } from '$app/state';

	import type { NewsArticle } from '$lib/models/srf';
	import { pause, resume } from '$lib/screen.svelte';
	import { getNews } from '$lib/srf.remote';

	import EmptyCard from '../empty-card.svelte';
	import Loader from '../loader.svelte';
	import ErrorCard from '../error-card.svelte';

	let { name }: { name: string } = $props();

	let pageNr = $derived.by(() => {
		const pageStr = page.url.searchParams.get('page');
		const pageNr = pageStr ? Number(pageStr) : 0;
		return isFinite(pageNr) ? pageNr : 0;
	});

	let selectedArticle = $state<NewsArticle | null>(null);

	function select(item: NewsArticle | null) {
		selectedArticle = item;
		if (item) {
			pause();
		} else {
			resume();
		}
	}
</script>

{#if selectedArticle}
	<div class="details" transition:fade={{ duration: 500 }}>
		<iframe
			title="Story"
			src={`http://172.25.140.113:5173/services/${name}/details?article=${selectedArticle.id}`}
		></iframe>
		<button class="btn btn-sm btn-danger" onclick={() => select(null)} title="Close">
			<i class="fa-solid fa-xmark"></i>
		</button>
	</div>
{/if}

{#await getNews({ srv: name, page: pageNr })}
	<Loader />
{:then { articles }}
	<div class="mb-2"></div>

	{#if articles.length > 0}
		{#each articles as item (item.id)}
			<div role="presentation" class="row mt-1 flex-1" onclick={() => select(item)}>
				<div class="col-3 me-1 image">
					<img
						alt="Thumbnail"
						src={'/' + item.image}
						class="h-100 w-100"
						style="object-fit: cover; background-color: red;"
					/>
				</div>
				<div class="col abstract d-flex flex-column justify-content-around">
					<div class="fs-4">{item.title}</div>
					<div class="fs-6 text-secondary">
						{formatDistanceToNow(item.ts, { locale: de, addSuffix: true })}
					</div>
				</div>
			</div>
		{/each}
	{:else}
		<EmptyCard>Es wurden keine Newseinträge gefunden</EmptyCard>
	{/if}
{:catch err}
	<ErrorCard message="Error loading articles" params={err} />
{/await}

<style lang="scss">
	.abstract {
		font-size: 1em;
		line-height: 1.1em;
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
		z-index: 1000;

		.btn {
			position: absolute;
			top: 16px;
			right: 16px;
		}
	}

	.image {
		position: relative;
		overflow: hidden;

		img {
			position: absolute;
			max-width: 100%;
		}
	}
</style>

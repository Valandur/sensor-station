<script lang="ts">
	import { fade } from 'svelte/transition';
	import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
	import { de } from 'date-fns/locale/de';

	import type { NewsItem } from '$lib/models/srf';

	import EmptyCard from '../EmptyCard.svelte';

	export let name: string;
	export let items: NewsItem[];

	let selectedItem: NewsItem | null = null;

	function select(item: NewsItem | null) {
		selectedItem = item;
	}
</script>

<div class="h-100 d-flex flex-column">
	{#if selectedItem}
		<div class="details" transition:fade={{ duration: 500 }}>
			<iframe title="Story" src={`/widgets/${name}/details?article=${selectedItem.id}`} />
			<button class="btn btn-sm btn-danger" on:click={() => select(null)}>
				<i class="icofont-ui-close" />
			</button>
		</div>
	{/if}

	{#if items.length > 0}
		{#each items as item}
			<div role="presentation" class="row mt-1 flex-1" on:click={() => select(item)}>
				<div class="col-3 me-1 image">
					<img alt="Thumbnail" src={'/' + item.image} />
				</div>
				<div class="col abstract d-flex flex-column justify-content-around">
					<div class="fs-4">{item.title}</div>
					<div class="fs-6 text-muted">
						{formatDistanceToNow(item.ts, { locale: de, addSuffix: true })}
					</div>
				</div>
			</div>
		{/each}
	{:else}
		<EmptyCard>Es wurden keine Newseinträge gefunden</EmptyCard>
	{/if}
</div>

<style lang="scss">
	.abstract {
		font-size: 1.4em;
		line-height: 1em;
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

<script lang="ts">
	import type { Snippet } from 'svelte';

	import PageTitle from './page-title.svelte';
	import PerfectScrollbar from './perfect-scrollbar.svelte';

	let {
		title,
		subTitle = '',
		closeUrl = '/',
		show = true,
		children
	}: {
		title: string;
		subTitle?: string;
		closeUrl?: string;
		show?: boolean;
		children?: Snippet;
	} = $props();
</script>

{#if show}
	<PageTitle showReload {closeUrl}>
		{#snippet center()}
			{subTitle}
		{/snippet}

		{title}
	</PageTitle>

	<PerfectScrollbar class="row flex-fill">
		<div class="col d-flex flex-column">
			{@render children?.()}
		</div>
	</PerfectScrollbar>
{:else}
	{@render children?.()}
{/if}

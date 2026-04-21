<script lang="ts">
	import { onMount, onDestroy, type Snippet } from 'svelte';
	import PerfectScrollbar from 'perfect-scrollbar';
	import type { ClassValue } from 'svelte/elements';

	let container: HTMLDivElement;
	let ps: PerfectScrollbar;

	let { class: clazz, children }: { class: ClassValue; children?: Snippet } = $props();

	onMount(() => {
		ps = new PerfectScrollbar(container);
	});

	onDestroy(() => {
		if (ps) {
			ps.destroy();
		}
	});
</script>

<div bind:this={container} class={clazz}>
	{@render children?.()}
</div>

<style>
	/* Revert settings that are usually applied to all children of rows, but we don't want them on our scrollbar */
	:global(.row.ps > :not(.col)) {
		width: revert;
		max-width: revert;
		padding-right: revert;
		padding-left: revert;
		margin-top: revert;
	}
</style>

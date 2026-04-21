<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		showReload = false,
		closeUrl = '/',
		children,
		center
	}: { showReload: boolean; closeUrl?: string; children?: Snippet; center?: Snippet } = $props();

	function reload() {
		window.location.reload();
	}
</script>

<div class="row z-1">
	<div class="col-auto">
		<h1>{@render children?.()}</h1>
	</div>
	<div class="col align-self-center text-secondary">
		{@render center?.()}
	</div>
	<div class="col-auto">
		{#if showReload}
			<button class="btn-sm btn-theme btn" onclick={reload} title="Reload">
				<i class="fa-solid fa-rotate fa-lg"></i>
			</button>
		{/if}
		<a class="btn-sm btn btn-danger" href={closeUrl} title="Close">
			<i class="fa-solid fa-xmark fa-xl"></i>
		</a>
	</div>
</div>

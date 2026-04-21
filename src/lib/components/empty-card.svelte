<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children?: Snippet } = $props();
</script>

<div class="row mb-5">
	<div class="col"></div>

	<div class="col-6">
		<div class="card bg-success border-success bg-opacity-25">
			<div class="card-body">
				<h5 class="card-title mb-0">
					{@render children?.()}
				</h5>
			</div>

			<div class="card-arrow">
				<div class="card-arrow-top-left"></div>
				<div class="card-arrow-top-right"></div>
				<div class="card-arrow-bottom-left"></div>
				<div class="card-arrow-bottom-right"></div>
			</div>
		</div>
	</div>

	<div class="col"></div>
</div>

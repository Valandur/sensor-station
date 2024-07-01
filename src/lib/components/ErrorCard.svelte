<script lang="ts">
	export let title: string | null = null;
	export let message: string | undefined;
	export let params: Record<string, unknown> | null = null;

	$: numParams = params ? Object.keys(params).length : 0;
</script>

<div class="alert alert-danger alert-dismissable fade show p-2">
	<div class="row">
		<div class="col">
			{#if title}
				<h4 class="alert-heading">{title}</h4>
			{/if}

			<p class:mb-0={numParams === 0}>{message || ''}</p>

			{#if numParams > 0}
				<pre class="bg-dark text-white mb-0"><code>{JSON.stringify(params, null, 2)}</code></pre>
			{/if}
		</div>

		<div class="col-auto d-flex flex-column">
			<button type="button" class="btn-close" data-bs-dismiss="alert"></button>
		</div>
	</div>
</div>

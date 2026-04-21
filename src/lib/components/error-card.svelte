<script lang="ts">
	let {
		title = null,
		message,
		params = null
	}: {
		title?: string | null;
		message: string | undefined;
		params?: Record<string, unknown> | null;
	} = $props();

	let numParams = $derived(params ? Object.keys(params).length : 0);
</script>

<div class="alert alert-danger alert-dismissable fade show p-2">
	<div class="row">
		<div class="col">
			{#if title}
				<h4 class="alert-heading">{title}</h4>
			{/if}

			<p class:mb-0={numParams === 0}>{message || ''}</p>

			{#if numParams > 0}
				<pre class="bg-dark mb-0 text-white"><code>{JSON.stringify(params, null, 2)}</code></pre>
			{/if}
		</div>

		<div class="d-flex flex-column col-auto">
			<button type="button" class="btn-close" data-bs-dismiss="alert" title="Close"></button>
		</div>
	</div>
</div>

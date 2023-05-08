<script lang="ts">
	export let title: string | null = null;
	export let message: string | undefined;
	export let params: Record<string, unknown> | null = null;
</script>

<div class="alert alert-danger m-0">
	{#if title}
		<h4 class="alert-heading">{title}</h4>
	{/if}
	<p>{message || ''}</p>
	{#if params && Object.keys(params).length > 0}
		<pre class="bg-dark text-white mb-0"><code>{JSON.stringify(params, null, 2)}</code></pre>
	{/if}
</div>

<script lang="ts">
	import { page } from '$app/stores';

	$: pageName = $page.route.id;
	$: embedded = $page.error?.embedded;
	$: errorMessage = $page.error?.message;
	$: params = $page.error?.params;
</script>

<div class="container-fluid m-0 {embedded ? 'p-0' : 'p-2'} d-flex flex-column">
	{#if !embedded}
		<div class="row">
			<div class="col">
				<h1>Server Error</h1>
			</div>
			<div class="col-auto">
				<a class="btn btn-sm btn-danger" href="/">
					<i class="icofont-ui-close" />
				</a>
			</div>
		</div>
	{/if}

	<div class="alert alert-danger">
		{#if pageName}
			<h4 class="alert-heading">{pageName}</h4>
		{/if}
		<p>{errorMessage}</p>
		{#if params}
			<pre class="bg-dark text-white mb-0"><code>{JSON.stringify(params, null, 2)}</code></pre>
		{/if}
	</div>
</div>

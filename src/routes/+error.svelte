<script lang="ts">
	import { page } from '$app/stores';

	import ErrorCard from '$lib/components/ErrorCard.svelte';

	$: embedded = $page.error?.embedded;
	$: title = $page.route.id;
	$: message = $page.error?.message;
	$: params = $page.error?.params;
</script>

<div class="container-fluid vh-100 d-flex flex-column {embedded ? 'p-0' : 'p-2'}">
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

	<ErrorCard {title} {message} {params} />
</div>

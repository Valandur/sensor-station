<script lang="ts">
	import { page } from '$app/stores';

	import ErrorCard from '$lib/components/ErrorCard.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';

	$: embedded = $page.error?.embedded;
	$: title = $page.route.id;
	$: message = $page.error?.message;
	$: params = $page.error?.params;
</script>

<div class="container-fluid h-100 overflow-auto p-2">
	{#if !embedded}
		<PageTitle showReload>Server Error</PageTitle>
	{/if}

	<ErrorCard {title} {message} {params} />
</div>

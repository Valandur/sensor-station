<script lang="ts">
	import { page } from '$app/stores';

	import ErrorCard from '$lib/components/ErrorCard.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';

	$: embedded = $page.error?.embedded;
	$: title = $page.route.id;
	$: message = $page.error?.message;
	$: params = $page.error?.params;
</script>

{#if !embedded}
	<PageTitle showReload closeUrl="/services">Server Error</PageTitle>
{/if}

<ErrorCard {title} {message} {params} />

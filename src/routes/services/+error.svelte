<script lang="ts">
	import { page } from '$app/state';

	import ErrorCard from '$lib/components/error-card.svelte';
	import PageTitle from '$lib/components/page-title.svelte';

	let embedded = $derived(page.error?.embedded);
	let title = $derived(page.route.id);
	let message = $derived(page.error?.message);
	let params = $derived(page.error?.params);
</script>

{#if !embedded}
	<PageTitle showReload closeUrl="/services">Server Error</PageTitle>
{/if}

<ErrorCard {title} {message} {params} />

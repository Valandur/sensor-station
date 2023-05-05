<script lang="ts">
	import { page } from '$app/stores';

	import ErrorCard from '$lib/components/ErrorCard.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';

	$: message = $page.error?.message;
	$: params = $page.error?.params;
</script>

<div class="container-fluid vh-100 d-flex flex-column p-1">
	<PageTitle showReload>Modem</PageTitle>
	<ErrorCard {message} {params} />
</div>

<script lang="ts">
	import { page } from '$app/stores';

	import ErrorCard from '$lib/components/ErrorCard.svelte';

	$: title = $page.route.id?.replace('/screens/', '');
	$: message = $page.error?.message;
	$: params = $page.error?.params;
</script>

<div class="container-fluid h-100 overflow-auto p-2">
	<ErrorCard {title} {message} {params} />
</div>

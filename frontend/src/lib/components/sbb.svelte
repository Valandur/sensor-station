<script lang="ts">
	import { onDestroy } from 'svelte';
	import { getContextClient, queryStore } from '@urql/svelte';

	import { GET_SBB, type GetSBB } from '$lib/models/sbb';
	import { getStore } from '$lib/stores/counter';

	export let params: string = '';
	params; // svelte hack to disable unused variable warning

	const MAX_ITEMS = 3;

	$: store = queryStore<GetSBB>({
		query: GET_SBB,
		context: { additionalTypenames: ['SBBAlert'] },
		requestPolicy: 'cache-and-network',
		client: getContextClient()
	});

	$: rawAlerts = $store.data?.sbb.alerts || [];
	$: index = getStore('alerts', rawAlerts.length);
	$: alerts = [
		...rawAlerts.slice($index, $index + MAX_ITEMS),
		...rawAlerts.slice(0, Math.max(MAX_ITEMS - (rawAlerts.length - $index), 0))
	];

	onDestroy(async () => {
		index.increment();
	});
</script>

<div class="container-fluid h-100 m-0 d-flex flex-column" style="overflow-y: auto">
	{#if alerts.length > 0}
		{#each alerts as alert}
			<div class="alert alert-warning m-1 p-2">
				<p class="m-0">{alert.summary}</p>
				<hr class="m-1" />
				<p class="m-0">{alert.duration}</p>
			</div>
		{/each}
	{:else}
		<div class="alert alert-info m-1 p-2">Keine Einschränkungen im ÖV in der Region Zürich</div>
	{/if}
</div>

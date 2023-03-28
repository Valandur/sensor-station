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
	$: alerts = [...rawAlerts.slice($index, $index + MAX_ITEMS)];

	const formatDuration = (duration: string) => duration.replace('Dauer: ', '');
	const formatLines = (lines: string) => lines.replace('Linien ', '');
	const formatReason = (reason: string) => reason.replace('Grund: ', '');

	onDestroy(async () => {
		index.increment();
	});
</script>

<div class="container-fluid h-100 m-0 d-flex flex-column justify-content-end">
	{#if alerts.length > 0}
		<div class="row row-cols-2">
			{#each alerts as alert}
				<div class="col">
					<div class="card bg-warning border-warning bg-opacity-25">
						<div class="card-header fw-bold small d-flex justify-content-between">
							<div>{formatLines(alert.description)}</div>
							<div><i class="icofont-clock-time" /> {formatDuration(alert.duration)}</div>
						</div>
						<div class="card-body">
							<h5 class="card-title">{alert.summary}</h5>
							<h6 class="card-subtitle mb-2 text-white text-opacity-50">
								{formatReason(alert.reason)}
							</h6>
							<p class="card-text">{alert.consequence}</p>
						</div>

						<div class="card-arrow">
							<div class="card-arrow-top-left" />
							<div class="card-arrow-top-right" />
							<div class="card-arrow-bottom-left" />
							<div class="card-arrow-bottom-right" />
						</div>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<div class="row">
			<div class="col">
				<div class="card bg-success border-success bg-opacity-25">
					<div class="card-body">
						<h5 class="card-title mb-0">Keine Einschränkungen im ÖV in der Region Zürich</h5>
					</div>

					<div class="card-arrow">
						<div class="card-arrow-top-left" />
						<div class="card-arrow-top-right" />
						<div class="card-arrow-bottom-left" />
						<div class="card-arrow-bottom-right" />
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

<script lang="ts" context="module">
	const QUERY = gql`
		query SBB {
			...SBBAlerts
		}
		${SBB_ALERTS}
	`;

	export const sbbMeta: ComponentMeta<SBBAlert[]> = {
		getData: async () => {
			const client = getClient();
			const res = await client
				.query<SBBAlerts>(
					QUERY,
					{},
					{ additionalTypenames: ['SBBAlert'], requestPolicy: 'cache-and-network' }
				)
				.toPromise();
			if (res.error) {
				throw res.error;
			}
			if (!res.data) {
				throw new Error('Could not get data for sbb');
			}
			return res.data.sbb.alerts || [];
		},
		skip: (params, data) => {
			return data.length === 0;
		}
	};
</script>

<script lang="ts">
	import { gql } from '@urql/svelte';
	import { format } from 'date-fns';
	import { onDestroy } from 'svelte';

	import { getClient } from '$lib/client';
	import { getStore } from '$lib/stores/counter';
	import { SBB_ALERTS, type SBBAlert, type SBBAlerts } from '$lib/models/sbb';
	import type { ComponentMeta } from '$lib/component';

	export let params: string = '';
	params; // svelte hack to disable unused variable warning
	export let data: SBBAlert[];

	$: index = getStore('alerts', data.length);
	$: alert = data[$index];

	const formatTitle = (title: string) => title.replace('Einschränkung', '').trim();
	const formatDuration = (duration: string) =>
		duration
			.replace('Dauer:', '')
			.replaceAll(`${format(new Date(), 'dd.MM.yyyy')},`, '')
			.trim();
	const formatLines = (lines: string) => lines.replace('Linien', '').trim();
	const formatReason = (reason: string) => reason.replace('Grund:', '').trim();

	onDestroy(async () => {
		index.increment();
	});
</script>

<div class="container-fluid h-100 m-0 d-flex flex-column justify-content-end">
	{#if alert}
		<div class="row">
			<div class="col-1" />
			<div class="col-10">
				<div class="card bg-warning border-warning bg-opacity-25">
					<div class="card-header border-warning fw-bold small d-flex justify-content-between">
						<div>
							{formatLines(alert.description)}
						</div>
						<div>
							<i class="icofont-clock-time" />
							{formatDuration(alert.duration)}
						</div>
					</div>
					<div class="card-body">
						<h5 class="card-title">
							{formatTitle(alert.summary)}
						</h5>
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
			<div class="col-1" />
		</div>
	{:else}
		<div class="row mb-5">
			<div class="col" />
			<div class="col-6">
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
			<div class="col" />
		</div>
	{/if}
</div>

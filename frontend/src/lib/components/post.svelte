<script lang="ts" context="module">
	export const postMeta: ComponentMeta<GetPostData> = {
		getData: async () => {
			const client = getClient();
			const res = await client
				.query<GetPostData>(
					GET_POST,
					{},
					{ additionalTypenames: ['PostShipment'], requestPolicy: 'cache-and-network' }
				)
				.toPromise();
			return res.data || null;
		},
		skip: async (params, data) => {
			return data?.post.shipments.length === 0;
		}
	};
</script>

<script lang="ts">
	import { onDestroy } from 'svelte';

	import type { ComponentMeta } from '$lib/component';
	import { getStore } from '$lib/stores/counter';
	import { getClient } from '$lib/client';
	import { GET_POST, type GetPostData } from '$lib/models/post';
	import { format, parseISO } from 'date-fns';

	export let params: string = '';
	params; // svelte hack to disable unused variable warning
	export let data: GetPostData;

	const MAX_ITEMS = 3;

	$: rawShipments = data.post.shipments || [];
	$: index = getStore('shipments', rawShipments.length);
	$: shipments = [...rawShipments.slice($index, $index + MAX_ITEMS)];

	const formatDims = ({ x, y, z }: { x: number; y: number; z: number }) => {
		return `${Math.round(x / 10)} x ${Math.round(y / 10)} x ${Math.round(z / 10)} cm`;
	};
	const formatWeight = (weight: number) => {
		return weight > 1000 ? `${Math.round(weight / 100) / 10} kg` : `${weight} g`;
	};

	onDestroy(async () => {
		index.increment();
	});
</script>

<div class="container-fluid h-100 m-0 d-flex flex-column justify-content-end">
	{#if shipments.length > 0}
		<div class="row row-cols-2">
			{#each shipments as shipment}
				<div class="col">
					<div class="card bg-theme border-theme bg-opacity-25">
						<div class="card-header fw-bold small d-flex justify-content-between">
							<div>{shipment.type}</div>
							<div>
								<i class="icofont-calendar" />
								{format(parseISO(shipment.arrival), 'dd.MM.yy')}
							</div>
						</div>
						<div class="card-body">
							<h5 class="card-title">{shipment.sender}</h5>
							<h6 class="card-subtitle mb-2 text-white text-opacity-50">
								{shipment.id}
							</h6>
							<p class="card-text">
								<i class="icofont-drag3" />
								{formatDims(shipment.dims)}
								<br />
								<i class="icofont-measure" />
								{formatWeight(shipment.weight)}
							</p>
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
		<div class="row mb-5">
			<div class="col" />
			<div class="col-6">
				<div class="card bg-success border-success bg-opacity-25">
					<div class="card-body">
						<h5 class="card-title mb-0">Keine Sendungen der Post unterwegs</h5>
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

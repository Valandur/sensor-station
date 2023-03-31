<script lang="ts" context="module">
	export const postMeta: ComponentMeta<Post> = {
		getData: async () => {
			const client = getClient();
			const res = await client
				.query<GetPostData>(
					GET_POST,
					{},
					{ additionalTypenames: ['PostShipment'], requestPolicy: 'cache-and-network' }
				)
				.toPromise();
			if (res.error) {
				throw res.error;
			}
			if (!res.data) {
				throw new Error('Could not get data for post');
			}
			return res.data.post;
		},
		skip: (params, data) => {
			return (data.shipments?.length || 0) === 0;
		}
	};
</script>

<script lang="ts">
	import { onDestroy } from 'svelte';

	import type { ComponentMeta } from '$lib/component';
	import { getStore } from '$lib/stores/counter';
	import { getClient } from '$lib/client';
	import { GET_POST, type GetPostData, type Post } from '$lib/models/post';
	import { format, parseISO } from 'date-fns';

	export let params: string = '';
	params; // svelte hack to disable unused variable warning
	export let data: Post;

	const MAX_ITEMS = 3;

	$: rawShipments = data.shipments || [];
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
						<div class="card-header border-theme fw-bold small d-flex justify-content-between">
							<div>{shipment.type}</div>
							{#if shipment.arrival}
								<div>
									<i class="icofont-calendar" />
									{format(parseISO(shipment.arrival), 'dd.MM.yy')}
								</div>
							{/if}
						</div>
						<div class="card-body">
							<h5 class="card-title">{shipment.sender}</h5>
							<h6 class="card-subtitle mb-2 text-white text-opacity-50">
								{shipment.number}
							</h6>
							{#if shipment.dims}
								<p class="card-text">
									<i class="icofont-drag3" />
									{formatDims(shipment.dims)}
								</p>
							{/if}
							{#if shipment.weight}
								<p>
									<i class="icofont-measure" />
									{formatWeight(shipment.weight)}
								</p>
							{/if}
							{#if shipment.status}
								<p>
									<i class="icofont-bullhorn" />
									{shipment.status}
								</p>
							{/if}
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

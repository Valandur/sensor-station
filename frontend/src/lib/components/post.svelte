<script lang="ts" context="module">
	const QUERY = gql`
		query Post {
			...PostShipments
		}
		${POST_SHIPMENTS}
	`;

	export const postMeta: ComponentMeta<PostShipment[]> = {
		getData: async () => {
			const client = getClient();
			const res = await client
				.query<PostShipments>(
					QUERY,
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
			return res.data.post.shipments || [];
		},
		skip: (params, data) => {
			return data.length === 0;
		}
	};
</script>

<script lang="ts">
	import { gql } from '@urql/svelte';
	import { format, parseISO } from 'date-fns';
	import { onDestroy } from 'svelte';

	import { getClient } from '$lib/client';
	import { getStore } from '$lib/stores/counter';
	import { POST_SHIPMENTS, type PostShipments, type PostShipment } from '$lib/models/post';
	import type { ComponentMeta } from '$lib/component';

	export let params: string = '';
	params; // svelte hack to disable unused variable warning
	export let data: PostShipment[];

	$: index = getStore('shipments', data.length);
	$: shipment = data[$index];

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
	{#if shipment}
		<div class="row">
			<div class="col-2" />
			<div class="col-8">
				<div class="card bg-theme border-theme bg-opacity-25">
					<div class="card-header border-theme fw-bold small d-flex justify-content-between">
						<div>
							{shipment.number}
						</div>
						{#if shipment.arrival}
							<div>
								<i class="icofont-calendar" />
								{format(parseISO(shipment.arrival), 'dd.MM.yy')}
							</div>
						{/if}
					</div>
					<div class="card-body">
						<h5 class="card-title">
							{shipment.sender}
						</h5>
						<h6 class="card-subtitle mb-2 text-white text-opacity-50">
							{shipment.type}
						</h6>
						{#if shipment.dims}
							<i class="icofont-drag3" />
							{formatDims(shipment.dims)}
							<br />
						{/if}
						{#if shipment.weight}
							<i class="icofont-measure" />
							{formatWeight(shipment.weight)}
							<br />
						{/if}
						{#if shipment.status}
							<i class="icofont-bullhorn" />
							{shipment.status}
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
			<div class="col-2" />
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

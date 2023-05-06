<script lang="ts">
	import { format } from 'date-fns';
	import de from 'date-fns/locale/de/index';

	import { goto } from '$app/navigation';

	import { swipe } from '$lib/swipe';
	import EmptyCard from '$lib/components/EmptyCard.svelte';

	import type { PageData } from './$types';

	export let data: PageData;
	$: shipment = data.shipment;
	$: prevPage = data.prevPage;
	$: nextPage = data.nextPage;

	function formatDims({ x, y, z }: { x: number; y: number; z: number }) {
		return `${Math.round(x / 10)} x ${Math.round(y / 10)} x ${Math.round(z / 10)} cm`;
	}

	function formatWeight(weight: number) {
		return weight > 1000 ? `${Math.round(weight / 100) / 10} kg` : `${weight} g`;
	}
</script>

<div
	class="h-100 d-flex flex-column justify-content-end"
	use:swipe={{ y: 100 }}
	on:swipe={(e) => goto(e.detail.dir === 'up' ? nextPage : prevPage)}
>
	{#if shipment}
		<div class="row">
			<div class="col">
				<div class="card bg-theme border-theme bg-opacity-25">
					<div class="card-header border-theme fw-bold small d-flex justify-content-between">
						<div>
							{shipment.number}
						</div>
						{#if shipment.arrival}
							<div>
								<i class="icofont-calendar" />
								{format(shipment.arrival, 'dd.MM.yy', { locale: de })}
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
						<p class="card-text">
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
		</div>
	{:else}
		<EmptyCard>Keine Sendungen der Post unterwegs</EmptyCard>
	{/if}
</div>

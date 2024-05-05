<script lang="ts">
	import { format, parseISO } from 'date-fns';
	import { de } from 'date-fns/locale';

	import { goto } from '$app/navigation';

	import { swipe } from '$lib/swipe';
	import EmptyCard from '$lib/components/EmptyCard.svelte';
	import Card from '$lib/components/Card.svelte';

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
				<Card>
					<svelte:fragment slot="header">
						<div>
							{shipment.number}
						</div>
						{#if shipment.arrival}
							<div>
								<i class="icofont-calendar" />
								{format(parseISO(shipment.arrival), 'dd.MM.yy', { locale: de })}
							</div>
						{/if}
					</svelte:fragment>

					<svelte:fragment slot="title">
						{shipment.sender ?? shipment.type}
					</svelte:fragment>

					<svelte:fragment slot="subTitle">
						{shipment.sender ? shipment.type : ''}
					</svelte:fragment>

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
				</Card>
			</div>
		</div>
	{:else}
		<EmptyCard>Keine Sendungen der Post unterwegs</EmptyCard>
	{/if}
</div>

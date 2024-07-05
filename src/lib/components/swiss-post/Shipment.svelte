<script lang="ts">
	import { de } from 'date-fns/locale/de';
	import { formatInTimeZone } from 'date-fns-tz';
	import { parseISO } from 'date-fns/parseISO';

	import { tz } from '$lib/stores/tz';
	import type { Shipment, SwissPostServiceMainData } from '$lib/models/swiss-post';
	import EmptyCard from '$lib/components/EmptyCard.svelte';

	import Card from '../Card.svelte';

	export let data: SwissPostServiceMainData;
	$: shipment = data.shipment;
	$: event = shipment.events[0];

	function formatDims({ x, y, z }: { x: number; y: number; z: number }) {
		return `${Math.round(x / 10)} x ${Math.round(y / 10)} x ${Math.round(z / 10)} cm`;
	}

	function formatWeight(weight: number) {
		return weight > 1000 ? `${Math.round(weight / 100) / 10} kg` : `${weight} g`;
	}
</script>

<div class="row flex-1"></div>

{#if shipment}
	<div class="row">
		<div class="col">
			<Card>
				<svelte:fragment slot="header">
					<div>
						<i class="fa-solid fa-hashtag"></i>
						{shipment.number}
					</div>
					{#if shipment.arrival}
						<div>
							<i class="fa-solid fa-calendar"></i>
							{formatInTimeZone(parseISO(shipment.arrival), $tz, 'dd.MM.yy', { locale: de })}
						</div>
					{/if}
				</svelte:fragment>

				<svelte:fragment slot="title">
					{shipment.sender ?? shipment.type}
				</svelte:fragment>

				<svelte:fragment slot="subTitle">
					{shipment.sender ? shipment.type : ''}
				</svelte:fragment>

				<div class="row">
					<div class="col">
						{#if shipment.dims}
							<i class="fa-solid fa-ruler-combined"></i>
							{formatDims(shipment.dims)}
							<br />
						{/if}

						{#if shipment.weight}
							<i class="fa-solid fa-scale-balanced"></i>
							{formatWeight(shipment.weight)}
							<br />
						{/if}

						{#if shipment.status}
							<i class="fa-solid fa-truck-fast"></i>
							{shipment.status}
						{/if}
					</div>

					<div class="col">
						{#if event}
							<div>{formatInTimeZone(event.ts, $tz, 'dd.MM.yy - HH:mm:ss', { locale: de })}</div>
							<div>{event.event}</div>
						{/if}
					</div>
				</div>
			</Card>
		</div>
	</div>
{:else}
	<EmptyCard>Keine Sendungen der Post unterwegs</EmptyCard>
{/if}

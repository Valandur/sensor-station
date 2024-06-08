<script lang="ts">
	import { de } from 'date-fns/locale/de';
	import { formatInTimeZone } from 'date-fns-tz';
	import { parseISO } from 'date-fns/parseISO';

	import { tz } from '$lib/stores/tz';
	import type { PostShipment } from '$lib/models/post';
	import EmptyCard from '$lib/components/EmptyCard.svelte';

	import Card from '../Card.svelte';

	export let shipment: PostShipment;

	function formatDims({ x, y, z }: { x: number; y: number; z: number }) {
		return `${Math.round(x / 10)} x ${Math.round(y / 10)} x ${Math.round(z / 10)} cm`;
	}

	function formatWeight(weight: number) {
		return weight > 1000 ? `${Math.round(weight / 100) / 10} kg` : `${weight} g`;
	}
</script>

<div class="h-100 d-flex flex-column justify-content-end">
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

<script lang="ts">
	import type { ModemServiceMainData } from '$lib/models/modem';

	export let data: ModemServiceMainData;
	$: info = data.info;
</script>

{#if info?.cellular.operator}
	<div class="col-auto">
		<i class="fa-solid fa-globe"></i>
		{info.cellular.operator.split(' ', 2)[0]}
	</div>
{/if}

{#if info?.cellular.signal}
	<div class="col-auto">
		<i class="fa-solid fa-signal"></i>
		{info.cellular.signal.toFixed(0)}%
	</div>
{/if}

{#if info?.gps}
	<div class="col-auto">
		<i class="fa-solid fa-satellite"></i>
		{info.gps.lat.toFixed(2)} | {info.gps.lng.toFixed(2)}
	</div>
{:else if info?.geo}
	<div class="col-auto">
		<i class="fa-solid fa-earth-europe"></i>
		{info.geo.lat.toFixed(2)} | {info.geo.lng.toFixed(2)}
	</div>
{/if}

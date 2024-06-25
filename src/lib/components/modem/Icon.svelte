<script lang="ts">
	import type { ModemInfo } from '$lib/models/modem';

	export let modem: ModemInfo | undefined;
</script>

{#if modem?.cellular.operator}
	<div class="col-auto">
		<i class="icofont-globe" />
		{modem.cellular.operator.split(' ', 2)[0]}
	</div>
{/if}

{#if modem?.cellular.signal}
	<div class="col-auto">
		<i class="icofont-signal" />
		{modem.cellular.signal.toFixed(0)}%
	</div>
{/if}

{#if modem?.gps}
	<div class="col-auto">
		<i class="icofont-satellite"></i>
		{modem.gps.lat.toFixed(2)} | {modem.gps.lng.toFixed(2)}
	</div>
{:else if modem?.geo}
	<div class="col-auto">
		<i class="icofont-world"></i>
		{modem.geo.lat.toFixed(2)} | {modem.geo.lng.toFixed(2)}
	</div>
{/if}

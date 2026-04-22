<script lang="ts">
	import type { DhtSensorServiceMainData } from '$lib/models/dht-sensor';

	export let data: DhtSensorServiceMainData;
	$: measurement = data.measurement;
</script>

<div>{measurement.temp}°C</div>
<div>{measurement.rh}% RH</div>

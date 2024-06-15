<script lang="ts">
	import type { Measurement } from '$lib/models/dht-sensor';

	export let measurement: Measurement;
</script>

<div>{measurement.temp}°C</div>
<div>{measurement.rh}% RH</div>

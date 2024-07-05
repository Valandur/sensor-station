<script lang="ts">
	import type { BatteryServiceMainData } from '$lib/models/battery';

	export let data: BatteryServiceMainData;
	$: battery = data.info;
</script>

{#if battery}
	<div class="col-auto">
		{#if battery.charge > 95}
			<i class="fa-solid fa-battery-full"></i>
		{:else if battery.charge > 70}
			<i class="fa-solid fa-battery-three-quarters"></i>
		{:else if battery.charge > 45}
			<i class="fa-solid fa-battery-half"></i>
		{:else if battery.charge > 20}
			<i class="fa-solid fa-battery-quarter"></i>
		{:else}
			<i class="fa-solid fa-battery-empty"></i>
		{/if}
		{battery.charge}%
	</div>
{/if}

{#if battery?.state.includes('CHARGING')}
	<div class="col-auto">
		<i class="fa-solid fa-plug"></i>
	</div>
{/if}

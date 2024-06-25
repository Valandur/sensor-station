<script lang="ts">
	import type { BatteryInfo } from '$lib/models/battery';

	export let battery: BatteryInfo | undefined;
</script>

{#if battery}
	<div class="col-auto">
		{#if battery.charge > 70}
			<i class="icofont-battery-full" />
		{:else if battery.charge > 40}
			<i class="icofont-battery-half" />
		{:else if battery.charge > 10}
			<i class="icofont-battery-low" />
		{:else}
			<i class="icofont-battery-empty" />
		{/if}
		{battery.charge}%
	</div>
{/if}

{#if battery?.state.includes('CHARGING')}
	<div class="col-auto">
		<i class="icofont-plugin" />
	</div>
{/if}

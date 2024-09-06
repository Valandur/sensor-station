<script lang="ts">
	import type { BatteryInfo, BatteryServiceMainData } from '$lib/models/battery';

	export let data: BatteryServiceMainData;
	$: info = data.info;
	$: fault = info.fault;
	$: powerIn = info.powerIn;
	$: powerIn5vIo = info.powerIn5vIo;
</script>

<div class="row overflow-auto">
	<div class="col">
		<table class="table table-sm">
			<colgroup>
				<col />
				<col width="25%" />
				<col width="25%" />
				<col width="25%" />
			</colgroup>
			<tbody>
				<tr>
					<td>Status</td>
					<td colspan="2">{info.state}</td>
					<td>{info.charge}%</td>
				</tr>
				<tr>
					<td>Power IN</td>
					<td>{powerIn.state}</td>
					<td>{powerIn.voltage.toFixed(2)} V</td>
					<td>{powerIn.current.toFixed(2)} A</td>
				</tr>
				<tr>
					<td>Power 5V IO</td>
					<td>{powerIn5vIo.state}</td>
					<td>{powerIn5vIo.voltage.toFixed(2)} V</td>
					<td>{powerIn5vIo.current.toFixed(2)} A</td>
				</tr>
				<tr>
					<td>Button</td>
					<td>
						{#if info.isButton}
							<i class="fa-solid fa-check"></i>
						{:else}
							<i class="fa-solid fa-xmark"></i>
						{/if}
					</td>
					<td>Fault</td>
					<td>
						{#if info.isFault}
							<i class="fa-solid fa-check"></i>
						{:else}
							<i class="fa-solid fa-xmark"></i>
						{/if}
					</td>
				</tr>
				<tr>
					<td>Profile Invalid</td>
					<td>
						{#if fault.batteryProfileInvalid}
							<i class="fa-solid fa-check"></i>
						{:else}
							<i class="fa-solid fa-xmark"></i>
						{/if}
					</td>
					<td>Button Off</td>
					<td>
						{#if fault.buttonPowerOff}
							<i class="fa-solid fa-check"></i>
						{:else}
							<i class="fa-solid fa-xmark"></i>
						{/if}
					</td>
				</tr>
				<tr>
					<td>Charging Temp.</td>
					<td>{fault.chargingTemperatureFault}</td>
					<td>Forced Off</td>
					<td>
						{#if fault.forcedPowerOff}
							<i class="fa-solid fa-check"></i>
						{:else}
							<i class="fa-solid fa-xmark"></i>
						{/if}
					</td>
				</tr>
				<tr>
					<td>Sys Off</td>
					<td>
						{#if fault.forcedSysPowerOff}
							<i class="fa-solid fa-check"></i>
						{:else}
							<i class="fa-solid fa-xmark"></i>
						{/if}
					</td>
					<td>Watchdog</td>
					<td>
						{#if fault.watchdogReset}
							<i class="fa-solid fa-check"></i>
						{:else}
							<i class="fa-solid fa-xmark"></i>
						{/if}
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</div>

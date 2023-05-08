<script lang="ts">
	import { formatDistanceToNow } from 'date-fns';
	import de from 'date-fns/locale/de/index';

	import { time } from '$lib/stores/time';
	import PageLayout from '$lib/components/PageLayout.svelte';

	import type { PageData } from './$types';

	export let data: PageData;
	$: fault = data.fault;
	$: powerIn = data.powerIn;
	$: powerIn5vIo = data.powerIn5vIo;

	let timeStr = '';
	$: $time, (timeStr = formatDistanceToNow(data.ts, { addSuffix: true, locale: de }));
</script>

<PageLayout title="Battery" subTitle={timeStr}>
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
						<td colspan="2">{data.state}</td>
						<td>{data.charge}%</td>
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
							{#if data.isButton}
								<i class="icofont-check" />
							{:else}
								<i class="icofont-close" />
							{/if}
						</td>
						<td>Fault</td>
						<td>
							{#if data.isFault}
								<i class="icofont-check" />
							{:else}
								<i class="icofont-close" />
							{/if}
						</td>
					</tr>
					<tr>
						<td>Profile Invalid</td>
						<td>
							{#if fault.batteryProfileInvalid}
								<i class="icofont-check" />
							{:else}
								<i class="icofont-close" />
							{/if}
						</td>
						<td>Button Off</td>
						<td>
							{#if fault.buttonPowerOff}
								<i class="icofont-check" />
							{:else}
								<i class="icofont-close" />
							{/if}
						</td>
					</tr>
					<tr>
						<td>Charging Temp.</td>
						<td>{fault.chargingTemperatureFault}</td>
						<td>Forced Off</td>
						<td>
							{#if fault.forcedPowerOff}
								<i class="icofont-check" />
							{:else}
								<i class="icofont-close" />
							{/if}
						</td>
					</tr>
					<tr>
						<td>Sys Off</td>
						<td>
							{#if fault.forcedSysPowerOff}
								<i class="icofont-check" />
							{:else}
								<i class="icofont-close" />
							{/if}
						</td>
						<td>Watchdog</td>
						<td>
							{#if fault.watchdogReset}
								<i class="icofont-check" />
							{:else}
								<i class="icofont-close" />
							{/if}
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</PageLayout>

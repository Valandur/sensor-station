<script lang="ts">
	import { formatDistanceToNow } from 'date-fns';

	import { time } from '$lib/stores/time';

	import type { PageData } from './$types';

	export let data: PageData;
	$: status = data.status;

	let timeStr = '';
	$: if (status?.ts) {
		$time, (timeStr = formatDistanceToNow(status.ts, { addSuffix: true }));
	}

	function refresh() {
		// TODO
	}
</script>

<div class="container-fluid m-0 p-1 vh-100 d-flex flex-column">
	<div class="row">
		<div class="col-auto">
			<h1>Battery</h1>
		</div>
		<div class="col align-self-center text-secondary">
			{timeStr ? `(@ ${timeStr})` : ''}
		</div>
		<div class="col-auto">
			<button class="btn btn-sm btn-outline-theme" on:click={() => refresh()}>
				<i class="icofont-refresh" />
			</button>
			<a class="btn btn-sm btn-outline-danger" href="/">
				<i class="icofont-ui-close" />
			</a>
		</div>
	</div>

	<div class="row overflow-auto">
		<div class="col">
			{#if status}
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
							<td colspan="2">{status.state}</td>
							<td>{status.charge}%</td>
						</tr>
						<tr>
							<td>Power IN</td>
							<td>{status.powerIn.state}</td>
							<td>{status.powerIn.voltage.toFixed(2)} V</td>
							<td>{status.powerIn.current.toFixed(2)} A</td>
						</tr>
						<tr>
							<td>Power 5V IO</td>
							<td>{status.powerIn5vIo.state}</td>
							<td>{status.powerIn5vIo.voltage.toFixed(2)} V</td>
							<td>{status.powerIn5vIo.current.toFixed(2)} A</td>
						</tr>
						<tr>
							<td>Button</td>
							<td>
								{#if status.isButton}
									<i class="icofont-check" />
								{:else}
									<i class="icofont-close" />
								{/if}
							</td>
							<td>Fault</td>
							<td>
								{#if status.isFault}
									<i class="icofont-check" />
								{:else}
									<i class="icofont-close" />
								{/if}
							</td>
						</tr>
						<tr>
							<td>Profile Invalid</td>
							<td>
								{#if status.fault.batteryProfileInvalid}
									<i class="icofont-check" />
								{:else}
									<i class="icofont-close" />
								{/if}
							</td>
							<td>Button Off</td>
							<td>
								{#if status.fault.buttonPowerOff}
									<i class="icofont-check" />
								{:else}
									<i class="icofont-close" />
								{/if}
							</td>
						</tr>
						<tr>
							<td>Charging Temp.</td>
							<td>{status.fault.chargingTemperatureFault}</td>
							<td>Forced Off</td>
							<td>
								{#if status.fault.forcedPowerOff}
									<i class="icofont-check" />
								{:else}
									<i class="icofont-close" />
								{/if}
							</td>
						</tr>
						<tr>
							<td>Sys Off</td>
							<td>
								{#if status.fault.forcedSysPowerOff}
									<i class="icofont-check" />
								{:else}
									<i class="icofont-close" />
								{/if}
							</td>
							<td>Watchdog</td>
							<td>
								{#if status.fault.watchdogReset}
									<i class="icofont-check" />
								{:else}
									<i class="icofont-close" />
								{/if}
							</td>
						</tr>
					</tbody>
				</table>
			{:else}
				<div class="alert alert-danger m-2">No battery data!</div>
			{/if}
		</div>
	</div>
</div>

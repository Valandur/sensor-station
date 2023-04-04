<script lang="ts">
	import { getContextClient, gql, queryStore } from '@urql/svelte';

	import { BATTERY_STATUS, type BatteryStatus } from '$lib/models/battery';

	const QUERY = gql`
		query Battery {
			...BatteryStatus
		}
		${BATTERY_STATUS}
	`;

	$: client = getContextClient();
	$: store = queryStore<BatteryStatus>({
		query: QUERY,
		requestPolicy: 'cache-and-network',
		client
	});

	$: battery = $store.data?.battery.status;
</script>

<div class="container-fluid m-0 p-1 vh-100 d-flex flex-column">
	<div class="row">
		<div class="col">
			<h1>Battery</h1>
		</div>
		<div class="col-auto">
			<a class="btn btn-sm btn-outline-theme" href="/"><i class="icofont-ui-close" /></a>
		</div>
	</div>

	<div class="row overflow-auto">
		<div class="col">
			{#if $store.fetching}
				<p class="alert alert-info m-2">
					<i class="icofont-spinner" /> Loading...
				</p>
			{:else if battery}
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
							<td colspan="2">{battery.status}</td>
							<td>{battery.charge}%</td>
						</tr>
						<tr>
							<td>Power IN</td>
							<td>{battery.powerIn.state}</td>
							<td>{battery.powerIn.voltage} V</td>
							<td>{battery.powerIn.current} A</td>
						</tr>
						<tr>
							<td>Power 5V IO</td>
							<td>{battery.powerIn5vIo.state}</td>
							<td>{battery.powerIn5vIo.voltage} V</td>
							<td>{battery.powerIn5vIo.current} A</td>
						</tr>
						<tr>
							<td>Button</td>
							<td>
								{#if battery.isButton}
									<i class="icofont-check" />
								{:else}
									<i class="icofont-close" />
								{/if}
							</td>
							<td>Fault</td>
							<td>
								{#if battery.isFault}
									<i class="icofont-check" />
								{:else}
									<i class="icofont-close" />
								{/if}
							</td>
						</tr>
						<tr>
							<td>Profile Invalid</td>
							<td>
								{#if battery.fault.batteryProfileInvalid}
									<i class="icofont-check" />
								{:else}
									<i class="icofont-close" />
								{/if}
							</td>
							<td>Button Off</td>
							<td>
								{#if battery.fault.buttonPowerOff}
									<i class="icofont-check" />
								{:else}
									<i class="icofont-close" />
								{/if}
							</td>
						</tr>
						<tr>
							<td>Charging Temp.</td>
							<td>{battery.fault.chargingTemperatureFault}</td>
							<td>Forced Off</td>
							<td>
								{#if battery.fault.forcedPowerOff}
									<i class="icofont-check" />
								{:else}
									<i class="icofont-close" />
								{/if}
							</td>
						</tr>
						<tr>
							<td>Sys Off</td>
							<td>
								{#if battery.fault.forcedSysPowerOff}
									<i class="icofont-check" />
								{:else}
									<i class="icofont-close" />
								{/if}
							</td>
							<td>Watchdog</td>
							<td>
								{#if battery.fault.watchdogReset}
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

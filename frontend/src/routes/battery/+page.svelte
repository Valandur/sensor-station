<script lang="ts">
	import { getContextClient, gql, queryStore } from '@urql/svelte';

	import { BATTERY_STATUS, type BatteryStatus } from '$lib/models/battery';
	import { formatDistanceToNow, parseISO } from 'date-fns';

	const QUERY = gql`
		query Battery {
			...BatteryStatus
		}
		${BATTERY_STATUS}
	`;

	$: client = getContextClient();
	$: store = queryStore<BatteryStatus>({
		query: QUERY,
		requestPolicy: 'network-only',
		client
	});

	const refresh = () => {
		queryStore<BatteryStatus>({
			query: QUERY,
			requestPolicy: 'network-only',
			client
		});
	};

	$: battery = $store.data?.battery;
	$: status = battery?.status;
</script>

<div class="container-fluid m-0 p-1 vh-100 d-flex flex-column">
	<div class="row">
		<div class="col-auto">
			<h1>Battery</h1>
		</div>
		<div class="col align-self-center text-secondary">
			{#if battery?.updatedAt}
				(@ {formatDistanceToNow(parseISO(battery.updatedAt), { addSuffix: true })})
			{/if}
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
			{#if $store.fetching}
				<p class="alert alert-info m-2">
					<i class="icofont-spinner" /> Loading...
				</p>
			{:else if status}
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
							<td colspan="2">{status.status}</td>
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

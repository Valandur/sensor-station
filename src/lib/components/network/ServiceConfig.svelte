<script lang="ts">
	import { enhance } from '$app/forms';

	import type { NetworkServiceConfigData } from '$lib/models/network';

	export let form: Record<string, any> | null;
	export let data: NetworkServiceConfigData;

	let selectedSSID = '';
	$: connections = data.connections;
	$: networks = form?.networks ?? [];
</script>

<div class="row overflow-auto">
	<div class="col mt-2">
		<div class="row">
			<h2 class="col">WIFIs</h2>
			<form method="POST" class="col-auto" use:enhance>
				<input type="hidden" name="action" value="scan" />
				<button type="submit" class="btn btn-primary">
					<i class="fa-solid fa-magnifying-glass"></i>
				</button>
			</form>
		</div>

		<table class="table table-sm">
			<colgroup>
				<col width="100%" />
				<col />
				<col />
				<col />
				<col />
			</colgroup>
			<thead>
				<tr>
					<th>SSID</th>
					<th>GHz</th>
					<th>Cha.</th>
					<th>Sec.</th>
					<th>Qty</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{#each connections as connection}
					<tr class="table-active">
						<td>{connection.ssid}</td>
						<td>{(connection.frequency / 1000).toFixed(1)}</td>
						<td>{connection.channel}</td>
						<td>{connection.security}</td>
						<td>{connection.quality}</td>
						<td>
							<form method="POST" use:enhance>
								<input type="hidden" name="action" value="disconnect" />
								<input type="hidden" name="ssid" value={connection.ssid} />
								<button type="submit" class="btn btn-primary">
									<i class="fa-solid fa-link-slash"></i>
								</button>
							</form>
						</td>
					</tr>
				{/each}

				{#each networks as network}
					<tr>
						<td>{network.ssid}</td>
						<td>{(network.frequency / 1000).toFixed(1)}</td>
						<td>{network.channel}</td>
						<td>{network.security}</td>
						<td>{network.quality}</td>
						<td>
							<button
								type="button"
								class="btn btn-primary"
								data-bs-toggle="modal"
								data-bs-target="#modalWifi"
								on:click={() => (selectedSSID = network.ssid)}
							>
								<i class="fa-solid fa-link"></i>
							</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<form method="POST" use:enhance>
	<div class="modal fade" id="modalWifi" tabindex="-1">
		<div class="modal-dialog modal-xl">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Connect to {selectedSSID}</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal"></button>
				</div>
				<div class="modal-body">
					<input type="hidden" name="action" value="connect" />
					<input type="hidden" name="ssid" value={selectedSSID} />
					<input type="password" name="password" placeholder="Password" />
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-default" data-bs-dismiss="modal">Close</button>
					<button type="submit" class="btn btn-theme" data-bs-dismiss="modal">Connect</button>
				</div>
			</div>
		</div>
	</div>
</form>

<script lang="ts">
	import { applyAction, enhance } from '$app/forms';

	import type { NetworkServiceConfigData } from '$lib/models/network';

	export let name: string;
	export let form: Record<string, any> | null;
	export let data: NetworkServiceConfigData;

	$: connections = data.connections;
	$: networks = form?.networks ?? [];
</script>

<div class="row overflow-auto">
	<div class="col mt-2">
		<input type="hidden" name="name" value={name} />

		<div class="row">
			<h2 class="col">WIFIs</h2>
			<form
				method="POST"
				class="col-auto"
				use:enhance={() =>
					({ result }) =>
						applyAction(result)}
			>
				<input type="hidden" name="name" value={name} />
				<input type="hidden" name="action" value="scan" />
				<button type="submit" class="btn btn-primary">
					<i class="fa-solid fa-magnifying-glass"></i>
				</button>
			</form>
		</div>

		<table class="table table-sm">
			<colgroup>
				<col width="50%" />
				<col width="25%" />
				<col width="25%" />
				<col />
			</colgroup>
			<thead>
				<tr>
					<th>SSID</th>
					<th>Security</th>
					<th>Quality</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{#each connections as connection}
					<tr>
						<td>{connection.ssid}</td>
						<td>{connection.security}</td>
						<td>{connection.quality}</td>
						<td>
							<form
								method="POST"
								use:enhance={() =>
									({ result }) =>
										applyAction(result)}
							>
								<input type="hidden" name="name" value={name} />
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
						<td>{network.security}</td>
						<td>{network.quality}</td>
						<td>
							<form
								method="POST"
								use:enhance={() =>
									({ result }) =>
										applyAction(result)}
							>
								<input type="hidden" name="name" value={name} />
								<input type="hidden" name="action" value="connect" />
								<input type="hidden" name="ssid" value={network.ssid} />
								<button type="submit" class="btn btn-primary">
									<i class="fa-solid fa-link"></i>
								</button>
							</form>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

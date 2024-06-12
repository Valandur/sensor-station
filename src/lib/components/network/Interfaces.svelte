<script lang="ts">
	import type { NetworkInterface } from '$lib/models/network';

	export let interfaces: NetworkInterface[];
</script>

<div class="row overflow-auto">
	<div class="col">
		<table class="table table-sm">
			<thead>
				<tr>
					<th>Name</th>
					<th>Type</th>
					<th>Address</th>
					<th>MAC</th>
				</tr>
			</thead>
			<tbody>
				{#each interfaces as iface}
					{#each iface.addresses as address, i}
						<tr>
							<td class="fw-bold">{i === 0 ? iface.name : ''}</td>
							<td>{address.family}</td>
							<td>{address.address}</td>
							<td>{address.mac}</td>
						</tr>
					{/each}
				{/each}
			</tbody>
		</table>
	</div>
</div>

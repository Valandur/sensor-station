<script lang="ts">
	import { formatDistanceToNow } from 'date-fns';
	import de from 'date-fns/locale/de/index';

	import { time } from '$lib/stores/time';
	import PageLayout from '$lib/components/PageLayout.svelte';

	import type { PageData } from './$types';

	export let data: PageData;
	$: status = data.status;

	let timeStr = '';
	$: $time, (timeStr = formatDistanceToNow(status.ts, { addSuffix: true, locale: de }));
</script>

<PageLayout title="Network" subTitle={timeStr}>
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
					{#each status.interfaces as iface}
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
</PageLayout>

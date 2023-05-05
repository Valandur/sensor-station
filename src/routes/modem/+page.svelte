<script lang="ts">
	import { format, formatDistanceToNow } from 'date-fns';
	import de from 'date-fns/locale/de/index';

	import { time } from '$lib/stores/time';
	import PageLayout from '$lib/components/PageLayout.svelte';

	import type { PageData } from './$types';

	export let data: PageData;
	$: status = data.status;

	let timeStr = '';
	$: $time, (timeStr = formatDistanceToNow(status.ts, { addSuffix: true, locale: de }));
</script>

<PageLayout title="Modem" subTitle={timeStr}>
	<div class="row">
		<div class="col">
			<table class="table table-sm">
				<colgroup>
					<col />
					<col width="33%" />
					<col width="33%" />
				</colgroup>
				<tbody>
					<tr>
						<td>Connected</td>
						<td colspan="2">
							{#if status.isConnected}
								<i class="icofont-check" />
							{:else}
								<i class="icofont-close" />
							{/if}
						</td>
					</tr>
					<tr>
						<td>Operator</td>
						<td colspan="2">{status.operator}</td>
					</tr>
					<tr>
						<td>Signal</td>
						<td colspan="2">{status.signal}/4</td>
					</tr>
					<tr>
						<td>Time</td>
						<td colspan="2">{status.time ? format(status.time, 'Pp z', { locale: de }) : '---'}</td>
					</tr>
					<tr>
						<td>Location</td>
						<td>{status.lat}</td>
						<td>{status.lng}</td>
					</tr>
					<tr>
						<td>Timezone</td>
						<td>{status.tzName}</td>
						<td>{status.tzOffset}</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</PageLayout>

<script lang="ts">
	import { format, formatDistanceToNow } from 'date-fns';
	import { de } from 'date-fns/locale';

	import { time } from '$lib/stores/time';
	import PageLayout from '$lib/components/PageLayout.svelte';

	import type { PageData } from './$types';

	export let data: PageData;

	let timeStr = '';
	$: $time, (timeStr = formatDistanceToNow(data.ts, { addSuffix: true, locale: de }));
	$: cell = data.cellular;
</script>

<PageLayout title="Modem" subTitle={timeStr}>
	<div class="row">
		<div class="col">
			<table class="table table-sm">
				<colgroup>
					<col />
					<col width="33%" />
					<col width="33%" />
					<col width="33%" />
				</colgroup>
				<tbody>
					<tr>
						<td>Connected</td>
						<td colspan="2">
							{#if cell.operator !== null}
								<i class="icofont-check" />
							{:else}
								<i class="icofont-close" />
							{/if}
						</td>
					</tr>
					<tr>
						<td>Signal</td>
						<td colspan="3">{cell.signal}</td>
					</tr>
					<tr>
						<td>Operator</td>
						<td colspan="2">{cell.operator}</td>
						<td>{cell.netType}</td>
					</tr>
					<tr>
						<td>Time</td>
						<td colspan="2">{cell.time ? format(cell.time, 'P - p', { locale: de }) : '---'}</td>
						<td>{cell.tz}</td>
					</tr>
					<tr>
						<td>GPS</td>
						<td>{data.gps?.lat.toFixed(8) ?? '---'}</td>
						<td>{data.gps?.lng.toFixed(8) ?? '---'}</td>
						<td>{data.gps?.tz ?? '---'}</td>
					</tr>
					<tr>
						<td>GEO</td>
						<td>{data.geo?.lat.toFixed(8) ?? '---'}</td>
						<td>{data.geo?.lng.toFixed(8) ?? '---'}</td>
						<td>{data.geo?.tz ?? '---'}</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</PageLayout>

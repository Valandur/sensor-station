<script lang="ts">
	import { format, formatDate, formatDistanceToNow } from 'date-fns';
	// import { formatInTimeZone } from 'date-fns-tz';
	import { de } from 'date-fns/locale';

	import { time } from '$lib/stores/time';
	import PageLayout from '$lib/components/PageLayout.svelte';

	import type { PageData } from './$types';

	export let data: PageData;
	$: timezone = data?.gpsTz || data?.timeTz || 'Europe/Zurich';
	$: tzStr = formatDate($time, 'O', { locale: de });

	let timeStr = '';
	$: $time, (timeStr = formatDistanceToNow(data.ts, { addSuffix: true, locale: de }));
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
							{#if data.isConnected}
								<i class="icofont-check" />
							{:else}
								<i class="icofont-close" />
							{/if}
						</td>
					</tr>
					<tr>
						<td>Signal</td>
						<td colspan="2">{data.signal}/4</td>
					</tr>
					<tr>
						<td>Operator</td>
						<td colspan="2">{data.operator}</td>
					</tr>
					<tr>
						<td>Operator Time</td>
						<td>{data.time ? format(data.time, 'P - p', { locale: de }) : '---'}</td>
						<td>{data.timeTz}</td>
					</tr>
					<tr>
						<td>GPS Location</td>
						<td>{data.lat}</td>
						<td>{data.lng}</td>
					</tr>
					<tr>
						<td>GPS Timezone</td>
						<td>{data.gpsTz}</td>
						<td>{tzStr}</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</PageLayout>

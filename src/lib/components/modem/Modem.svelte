<script lang="ts">
	import { formatInTimeZone } from 'date-fns-tz';
	import { de } from 'date-fns/locale';

	import type { ModemServiceMainData } from '$lib/models/modem';

	export let data: ModemServiceMainData;
	$: info = data.info;
	$: cell = info.cellular;
</script>

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
					<td>Operator</td>
					<td colspan="2">{cell.operator}</td>
					<td>{cell.netType}</td>
				</tr>
				<tr>
					<td>Signal</td>
					<td>{cell.signal ? cell.signal.toFixed(0) + '%' : '---'}</td>
					<td>{cell.mcc}-{cell.mnc}</td>
					<td>{cell.lac}-{cell.cid}</td>
				</tr>
				<tr>
					<td>Time</td>
					<td>
						{cell.time && cell.tz
							? formatInTimeZone(cell.time, cell.tz, 'P', { locale: de })
							: '---'}
					</td>
					<td>
						{cell.time && cell.tz
							? formatInTimeZone(cell.time, cell.tz, 'p', { locale: de })
							: '---'}
					</td>
					<td>{cell.tz ?? '---'}</td>
				</tr>
				<tr>
					<td>GPS</td>
					<td>{info.gps?.lat.toFixed(8) ?? '---'}</td>
					<td>{info.gps?.lng.toFixed(8) ?? '---'}</td>
					<td>{info.gps?.tz ?? '---'}</td>
				</tr>
				<tr>
					<td>GEO</td>
					<td>{info.geo?.lat.toFixed(8) ?? '---'}</td>
					<td>{info.geo?.lng.toFixed(8) ?? '---'}</td>
					<td>{info.geo?.tz ?? '---'}</td>
				</tr>
			</tbody>
		</table>
	</div>
</div>

<script lang="ts">
	import { getContextClient, queryStore } from '@urql/svelte';
	import { format, parseISO } from 'date-fns';
	import de from 'date-fns/locale/de/index';

	import { GET_MODEM, type GetModemData } from '$lib/models/modem';

	$: client = getContextClient();
	$: store = queryStore<GetModemData>({
		query: GET_MODEM,
		requestPolicy: 'cache-and-network',
		client
	});

	$: modem = $store.data?.modem.status;
</script>

<div class="container-fluid m-0 p-1 vh-100 d-flex flex-column">
	<div class="row">
		<div class="col">
			<h1>Modem</h1>
		</div>
		<div class="col-auto">
			<a class="btn btn-sm btn-outline-theme" href="/"><i class="icofont-ui-close" /></a>
		</div>
	</div>

	<div class="row overflow-auto">
		<div class="col">
			{#if modem}
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
								{#if modem.isConnected}
									<i class="icofont-check" />
								{:else}
									<i class="icofont-close" />
								{/if}
							</td>
						</tr>
						<tr>
							<td>Cached</td>
							<td colspan="2">
								{#if modem.cached}
									<i class="icofont-check" />
								{:else}
									<i class="icofont-close" />
								{/if}
							</td>
						</tr>
						<tr>
							<td>Operator</td>
							<td colspan="2">{modem.operator}</td>
						</tr>
						<tr>
							<td>Signal</td>
							<td colspan="2">{modem.signal}/4</td>
						</tr>
						<tr>
							<td>Time</td>
							<td colspan="2">{format(parseISO(modem.time), 'Pp z', { locale: de })}</td>
						</tr>
						<tr>
							<td>Location</td>
							<td>{modem.lat}</td>
							<td>{modem.lng}</td>
						</tr>
						<tr>
							<td>Timezone</td>
							<td>{modem.tzName}</td>
							<td>{modem.tzOffset}</td>
						</tr>
					</tbody>
				</table>
			{:else}
				<div class="alert alert-danger">No modem data!</div>
			{/if}
		</div>
	</div>
</div>

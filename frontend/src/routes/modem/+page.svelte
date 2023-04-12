<script lang="ts">
	import { getContextClient, gql, queryStore } from '@urql/svelte';
	import { format, formatDistanceToNow, parseISO } from 'date-fns';
	import de from 'date-fns/locale/de/index';

	import { MODEM_STATUS, type ModemStatus } from '$lib/models/modem';
	import { time } from '$lib/stores/time';

	const QUERY = gql`
		query Modem {
			...ModemStatus
		}
		${MODEM_STATUS}
	`;

	$: client = getContextClient();
	$: store = queryStore<ModemStatus>({
		query: QUERY,
		requestPolicy: 'cache-and-network',
		client
	});

	function refresh() {
		queryStore<ModemStatus>({
			query: QUERY,
			requestPolicy: 'cache-and-network',
			client
		});
	}

	$: modem = $store.data?.modem;
	$: status = modem?.status;

	let timeStr = '';
	$: if (modem?.updatedAt) {
		$time, (timeStr = formatDistanceToNow(parseISO(modem.updatedAt), { addSuffix: true }));
	}
</script>

<div class="container-fluid m-0 p-1 vh-100 d-flex flex-column">
	<div class="row">
		<div class="col-auto">
			<h1>Modem</h1>
		</div>
		<div class="col align-self-center text-secondary">
			{timeStr ? `(@ ${timeStr})` : ''}
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
							<td>Cached</td>
							<td colspan="2">
								{#if status.cached}
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
							<td colspan="2">{format(parseISO(status.time), 'Pp z', { locale: de })}</td>
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
			{:else}
				<div class="alert alert-danger m-2">No modem data!</div>
			{/if}
		</div>
	</div>
</div>

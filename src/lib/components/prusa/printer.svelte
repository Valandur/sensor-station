<script lang="ts">
	import { de } from 'date-fns/locale';
	import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
	import { add } from 'date-fns/add';

	import { getStatus } from '$lib/prusa.remote';
	import EmptyCard from '$lib/components/empty-card.svelte';

	import Card from '../card.svelte';
	import Loader from '../loader.svelte';
	import ErrorCard from '../error-card.svelte';

	let { name }: { name: string } = $props();

	function secondsToEta(seconds: number) {
		return formatDistanceToNow(add(new Date(), { seconds: seconds }), { locale: de });
	}
</script>

<svelte:boundary>
	{@const { job, printer } = await getStatus({ srv: name })}

	<div class="row flex-1"></div>

	{#if job}
		<div class="row">
			<div class="col">
				<Card type="primary">
					{#snippet header()}
						<div>
							{printer.state} - #{job.id}
						</div>
						<div>
							<i class="fa-solid fa-gauge-high"></i>
							{printer.speed}%
						</div>
					{/snippet}

					<p class="display-6">
						Fertig in {secondsToEta(job.time_remaining)}
					</p>

					<div class="progress mb-4" style:height="4em">
						<div
							class="progress-bar display-6"
							role="progressbar"
							aria-valuenow={job.progress}
							aria-valuemin="0"
							aria-valuemax="100"
							style:width="{job.progress}%"
						>
							{job.progress}%
						</div>
					</div>

					<table class="table table-sm">
						<colgroup>
							<col style:width="25%" />
							<col style:width="25%" />
							<col style:width="25%" />
							<col style:width="25%" />
						</colgroup>
						<tbody>
							<tr>
								<td>Nozzle</td>
								<td class="fw-bold">{printer.temp_nozzle}°C</td>
								<td>-&gt;</td>
								<td>{printer.target_nozzle}°C</td>
							</tr>
							<tr>
								<td>Bed</td>
								<td class="fw-bold">{printer.temp_bed}°C</td>
								<td>-&gt;</td>
								<td>{printer.target_bed}°C</td>
							</tr>
						</tbody>
					</table>
				</Card>
			</div>
		</div>
	{:else}
		<EmptyCard>Aktuell ist kein Druckauftrag in Bearbeitung</EmptyCard>
	{/if}

	{#snippet pending()}
		<Loader />
	{/snippet}

	{#snippet failed(error)}
		<ErrorCard message="Error loading printer status" params={{ error }} />
	{/snippet}
</svelte:boundary>

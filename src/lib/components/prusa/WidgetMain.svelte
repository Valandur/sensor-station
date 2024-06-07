<script lang="ts">
	import { de } from 'date-fns/locale';
	import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
	import { add } from 'date-fns/add';

	import type { JobInfo, PrinterInfo } from '$lib/models/prusa';
	import EmptyCard from '$lib/components/EmptyCard.svelte';

	import Card from '../Card.svelte';

	export let job: JobInfo;
	export let printer: PrinterInfo;

	$: getETA = () => {
		const eta = add(new Date(), { seconds: job.time_remaining });
		return formatDistanceToNow(eta, { locale: de });
	};
</script>

<div class="h-100 d-flex flex-column justify-content-end">
	{#if job.id}
		<div class="row">
			<div class="col">
				<Card>
					<svelte:fragment slot="header">
						<div>
							{printer.state} - #{job.id}
						</div>
						<div>
							<i class="icofont-speed-meter"></i>
							{printer.speed}%
						</div>
					</svelte:fragment>

					<p class="display-6">
						Fertig in {getETA()}
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
								<td>{'->'}</td>
								<td>{printer.target_nozzle}°C</td>
							</tr>
							<tr>
								<td>Bed</td>
								<td class="fw-bold">{printer.temp_bed}°C</td>
								<td>{'->'}</td>
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
</div>

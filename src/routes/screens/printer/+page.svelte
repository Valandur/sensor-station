<script lang="ts">
	import { add, format, formatDistanceToNow } from 'date-fns';
	import de from 'date-fns/locale/de/index';

	import EmptyCard from '$lib/components/EmptyCard.svelte';

	import type { PageData } from './$types';

	export let data: PageData;
	$: job = data.info.job;
	$: printer = data.info.printer;

	$: getETA = () => {
		const eta = add(new Date(), { seconds: job.time_remaining });
		return formatDistanceToNow(eta, { locale: de });
	};
</script>

<div class="h-100 d-flex flex-column justify-content-end">
	{#if job.id}
		<div class="row">
			<div class="col">
				<div class="card bg-theme border-theme bg-opacity-25">
					<div class="card-header border-theme fw-bold small d-flex justify-content-between">
						<div>
							{printer.state} - #{job.id}
						</div>
						<div>
							<i class="icofont-speed-meter"></i>
							{printer.speed}%
						</div>
					</div>
					<div class="card-body">
						<p class="display-6">
							Fertig in {getETA()}
						</p>

						<div class="progress mb-4" style:height="100px">
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
					</div>

					<div class="card-arrow">
						<div class="card-arrow-top-left" />
						<div class="card-arrow-top-right" />
						<div class="card-arrow-bottom-left" />
						<div class="card-arrow-bottom-right" />
					</div>
				</div>
			</div>
		</div>
	{:else}
		<EmptyCard>Aktuell ist kein Druckauftrag in Bearbeitung</EmptyCard>
	{/if}
</div>

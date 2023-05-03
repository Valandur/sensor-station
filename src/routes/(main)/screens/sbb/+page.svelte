<script lang="ts">
	import { format } from 'date-fns';
	import { goto } from '$app/navigation';
	import de from 'date-fns/locale/de/index';

	import { swipe } from '$lib/swipe';

	import type { PageData } from './$types';

	export let data: PageData;
	$: alert = data.alert;

	function formatTitle(title: string | undefined) {
		return title?.replace('Einschränkung', '').trim();
	}

	function formatDuration(duration: string | undefined) {
		return duration
			?.replace('Dauer:', '')
			.replaceAll(`${format(new Date(), 'dd.MM.yyyy', { locale: de })},`, '')
			.trim();
	}

	function formatDescription(lines: string | undefined) {
		return lines?.replace('Linien', '').trim();
	}

	function formatReason(reason: string | undefined) {
		return reason?.replace('Grund:', '').trim();
	}
</script>

<div
	class="container-fluid h-100 m-0 d-flex flex-column justify-content-end"
	use:swipe={{ y: 100 }}
	on:swipe={(e) => goto(e.detail.dir === 'up' ? data.nextPage : data.prevPage)}
>
	{#if alert}
		<div class="row">
			<div class="col-1" />
			<div class="col-10">
				<div class="card bg-warning border-warning bg-opacity-25">
					<div class="card-header border-warning fw-bold small d-flex justify-content-between">
						<div>
							{formatDescription(alert.description)}
						</div>
						<div>
							<i class="icofont-clock-time" />
							{formatDuration(alert.duration)}
						</div>
					</div>
					<div class="card-body">
						<h5 class="card-title">
							{formatTitle(alert.summary)}
						</h5>
						<h6 class="card-subtitle mb-2 text-white text-opacity-50">
							{formatReason(alert.reason)}
						</h6>
						<p class="card-text">{alert.consequence}</p>
					</div>

					<div class="card-arrow">
						<div class="card-arrow-top-left" />
						<div class="card-arrow-top-right" />
						<div class="card-arrow-bottom-left" />
						<div class="card-arrow-bottom-right" />
					</div>
				</div>
			</div>
			<div class="col-1" />
		</div>
	{:else}
		<div class="row mb-5">
			<div class="col" />
			<div class="col-6">
				<div class="card bg-success border-success bg-opacity-25">
					<div class="card-body">
						<h5 class="card-title mb-0">Keine Einschränkungen im ÖV in der Region Zürich</h5>
					</div>

					<div class="card-arrow">
						<div class="card-arrow-top-left" />
						<div class="card-arrow-top-right" />
						<div class="card-arrow-bottom-left" />
						<div class="card-arrow-bottom-right" />
					</div>
				</div>
			</div>
			<div class="col" />
		</div>
	{/if}
</div>

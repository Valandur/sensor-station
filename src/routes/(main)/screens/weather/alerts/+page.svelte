<script lang="ts">
	import { format } from 'date-fns';
	import { goto } from '$app/navigation';
	import de from 'date-fns/locale/de/index';

	import { swipe } from '$lib/swipe';

	import type { PageData } from './$types';

	export let data: PageData;
	$: alert = data.alert;
</script>

<div
	class="container-fluid h-100 m-0 d-flex flex-column justify-content-end"
	use:swipe={{ y: 100 }}
	on:swipe={(e) => goto(e.detail.dir === 'up' ? data.nextPage : data.prevPage)}
>
	{#if alert}
		<div class="row mh-100">
			<div class="col-1" />
			<div class="col-10 mh-100">
				<div class="card bg-warning border-warning bg-opacity-25 h-100">
					<div class="card-header border-warning fw-bold small d-flex justify-content-between">
						<div>
							{alert.tags}
						</div>
						<div>
							<i class="icofont-calendar" />
							{format(alert.start, 'dd.MM.yy HH:mm', { locale: de })} -
							{format(alert.end, 'dd.MM.yy HH:mm', { locale: de })}
						</div>
					</div>
					<div class="card-body overflow-scroll">
						<h5 class="card-title">
							{alert.event}
						</h5>
						<h6 class="card-subtitle mb-2 text-white text-opacity-50">
							{alert.sender}
						</h6>
						<ul class="m-0 p-0 ms-3">
							{#each alert.content.split('\n') as line}
								<li>{line.substring(2)}</li>
							{/each}
						</ul>
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
						<h5 class="card-title mb-0">Aktuell sind keine Wetter-Warnungen vorhanden</h5>
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

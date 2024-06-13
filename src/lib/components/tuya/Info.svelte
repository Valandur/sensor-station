<script lang="ts">
	import type { TuyaInfo } from '$lib/models/tuya';

	import Card from '../Card.svelte';

	export let info: TuyaInfo;
</script>

<div class="h-100 d-flex flex-column justify-content-end">
	<div class="row">
		<div class="col">
			<Card>
				<svelte:fragment slot="header">
					<div>PIXI Smart Fountain</div>
					<div>
						<i class="icofont-power" />
						{info.on ? 'ON' : 'OFF'}
					</div>
				</svelte:fragment>

				<div class="row">
					<div class="col-3">
						<i class="icofont-filter"></i>
					</div>

					<div class="col">
						<div class="progress mt-1">
							<div
								class="progress-bar bg-danger"
								role="progressbar"
								aria-valuenow={info.filterLife}
								aria-valuemin="0"
								aria-valuemax="100"
								style:width="{info.filterLife}%"
							>
								{info.filterLife.toFixed(0)}%
							</div>
						</div>
					</div>
				</div>

				<div class="row">
					<div class="col-1">
						<i class="icofont-flash-light" />
					</div>

					<div class="col-2">
						{info.uv ? 'ON' : 'OFF'}
					</div>

					<div class="col">
						<div class="progress mt-1">
							<div
								class="progress-bar bg-danger"
								role="progressbar"
								aria-valuenow={info.uvRuntime}
								aria-valuemin="0"
								aria-valuemax="100"
								style:width="{info.uvRuntime}%"
							>
								{info.uvRuntime.toFixed(0)}%
							</div>
						</div>
					</div>
				</div>

				<div class="row">
					<div class="col-1">
						<i class="icofont-water-drop" />
					</div>

					<div class="col-2">
						{info.waterState ? 'ON' : 'OFF'}
					</div>

					<div class="col">
						<div class="progress mt-1">
							<div
								class="progress-bar"
								role="progressbar"
								aria-valuenow={info.waterLevel}
								aria-valuemin="0"
								aria-valuemax="100"
								style:width="{info.waterLevel}%"
							>
								{info.waterLevel}%
							</div>
						</div>
					</div>
				</div>
			</Card>
		</div>
	</div>
</div>

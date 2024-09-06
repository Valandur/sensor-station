<script lang="ts">
	import type { TuyaInfo, TuyaServiceMainData } from '$lib/models/tuya';

	import Card from '../Card.svelte';

	export let data: TuyaServiceMainData;
	$: info = data.info;
</script>

<div class="row flex-1"></div>

<div class="row">
	<div class="col">
		<Card>
			<svelte:fragment slot="header">
				<div>PIXI Smart Fountain</div>
				<div>
					<i class="fa-solid fa-power-off"></i>
					{info.on ? 'ON' : 'OFF'}
				</div>
			</svelte:fragment>

			<div class="row">
				<div class="col-3">
					<i class="fa-solid fa-filter"></i>
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
					<i class="fa-regular fa-lightbulb"></i>
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
					<i class="fa-solid fa-droplet"></i>
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

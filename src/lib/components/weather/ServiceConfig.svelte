<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import type { WeatherServiceConfig } from '$lib/models/weather';

	export let name: string;
	export let config: WeatherServiceConfig;
</script>

<form
	id="form"
	method="POST"
	action="?/save"
	class="mt-2"
	use:enhance={() =>
		({ result }) =>
			applyAction(result)}
>
	<input type="hidden" name="name" value={name} />

	<div class="row mb-2">
		<div class="col">
			<div class="form-check form-switch">
				<input
					type="checkbox"
					name="useGps"
					class="form-check-input"
					id="switchUseGps"
					checked={config.useGps}
				/>
				<label class="form-check-label" for="switchUseGps">Use GPS</label>
			</div>
		</div>
		<div class="col">
			<div class="form-check form-switch">
				<input
					type="checkbox"
					name="useGeo"
					class="form-check-input"
					id="switchUseGeo"
					checked={config.useGeo}
				/>
				<label class="form-check-label" for="switchUseGeo">Use GEO</label>
			</div>
		</div>
	</div>

	<div class="row mb-2">
		<label for="inputLat" class="col-3 col-form-label">Latitude</label>
		<div class="col">
			<input
				id="inputLat"
				type="number"
				name="lat"
				step="any"
				value={config.lat ?? '0.00'}
				class="form-control"
			/>
		</div>
	</div>

	<div class="row mb-2">
		<label for="inputLng" class="col-3 col-form-label">Longitude</label>
		<div class="col">
			<input
				id="inputLng"
				type="number"
				name="lng"
				step="any"
				value={config.lng ?? '0.00'}
				class="form-control"
			/>
		</div>
	</div>

	<div class="row mb-2">
		<label for="inputMinDiff" class="col-3 col-form-label">Min Diff</label>
		<div class="col">
			<input
				id="inputMinDiff"
				type="number"
				name="minDiff"
				value={config.minDiff ?? '1000'}
				class="form-control"
			/>
		</div>
	</div>

	<div class="row mb-2">
		<label for="inputApiKey" class="col-3 col-form-label">API key</label>
		<div class="col">
			<input
				id="inputApiKey"
				type="password"
				name="apiKey"
				value={config.apiKey ?? ''}
				class="form-control"
			/>
		</div>
	</div>

	<div class="row justify-content-end">
		<div class="col-auto">
			<button type="submit" class="btn btn-theme mt-2">Save</button>
		</div>
	</div>
</form>

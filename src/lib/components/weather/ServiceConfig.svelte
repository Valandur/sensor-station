<script lang="ts">
	import { applyAction, enhance } from '$app/forms';

	import type { WeatherServiceConfigData } from '$lib/models/weather';

	import CacheTime from '../CacheTime.svelte';

	export let data: WeatherServiceConfigData;

	let useGps = data.config.useGps;
	let useGeo = data.config.useGeo;
</script>

<ul class="nav nav-tabs">
	<li class="nav-item me-1">
		<a href="#general" class="nav-link active" data-bs-toggle="tab">General</a>
	</li>
	<li class="nav-item me-1">
		<a href="#modem" class="nav-link" data-bs-toggle="tab">Modem</a>
	</li>
	<li class="nav-item me-1">
		<a href="#cache" class="nav-link" data-bs-toggle="tab">Cache</a>
	</li>
</ul>

<form
	id="form"
	method="POST"
	class="tab-content flex-1 pt-3"
	use:enhance={() =>
		({ result }) =>
			applyAction(result)}
>
	<div class="tab-pane container-fluid fade show active" id="general">
		<div class="row mb-2">
			<label for="inputLat" class="col-4 col-form-label">Latitude</label>
			<div class="col">
				<input
					id="inputLat"
					type="number"
					name="lat"
					step="any"
					value={data.config.lat}
					class="form-control"
				/>
			</div>
		</div>

		<div class="row mb-2">
			<label for="inputLng" class="col-4 col-form-label">Longitude</label>
			<div class="col">
				<input
					id="inputLng"
					type="number"
					name="lng"
					step="any"
					value={data.config.lng}
					class="form-control"
				/>
			</div>
		</div>

		<div class="row mb-2">
			<label for="inputMinDiff" class="col-4 col-form-label">Min Diff</label>
			<div class="col">
				<input
					id="inputMinDiff"
					type="number"
					name="minDiff"
					value={data.config.minDiff}
					class="form-control"
				/>
			</div>
		</div>

		<div class="row mb-2">
			<label for="inputApiKey" class="col-4 col-form-label">API key</label>
			<div class="col">
				<input
					id="inputApiKey"
					type="password"
					name="apiKey"
					value={data.config.apiKey}
					class="form-control"
				/>
			</div>
		</div>

		<div class="row mb-2">
			<label for="inputGoogleKey" class="col-4 col-form-label">Google key</label>
			<div class="col">
				<input
					id="inputGoogleKey"
					type="password"
					name="googleKey"
					value={data.config.googleKey}
					class="form-control"
				/>
			</div>
		</div>

		<div class="row mb-2">
			<label for="inputItemsPerPage" class="col-4 col-form-label">Items per page</label>
			<div class="col">
				<input
					id="inputItemsPerPage"
					type="number"
					name="itemsPerPage"
					min="1"
					max="100"
					step="1"
					value={data.config.itemsPerPage}
					class="form-control"
				/>
			</div>
		</div>

		<div class="row justify-content-end">
			<div class="col-auto">
				<button type="submit" class="btn btn-theme mt-2">Save</button>
			</div>
		</div>
	</div>

	<div class="tab-pane container-fluid fade" id="modem">
		<div class="row mb-2">
			<div class="col">
				<div class="form-check form-switch">
					<input
						type="checkbox"
						name="useGps"
						class="form-check-input"
						id="switchUseGps"
						bind:checked={useGps}
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
						bind:checked={useGeo}
					/>
					<label class="form-check-label" for="switchUseGeo">Use GEO</label>
				</div>
			</div>
		</div>

		{#if useGps || useGeo}
			<div class="row mb-2">
				<label for="selectModemService" class="col-4 col-form-label">Modem</label>
				<div class="col">
					<select
						id="selectModemService"
						name="modemService"
						class="form-select"
						value={data.config.modemService}
					>
						{#each data.modems as srv}
							<option value={srv.name}>{srv.name}</option>
						{/each}
					</select>
				</div>
			</div>
		{:else}
			<input type="hidden" name="modemService" value="" />
		{/if}

		<div class="row justify-content-end">
			<div class="col-auto">
				<button type="submit" class="btn btn-theme mt-2">Save</button>
			</div>
		</div>
	</div>

	<div class="tab-pane container-fluid fade" id="cache">
		<CacheTime
			errorCacheTime={data.config.errorCacheTime}
			resultCacheTime={data.config.resultCacheTime}
		/>

		<div class="row justify-content-end">
			<div class="col-auto">
				<button type="submit" class="btn btn-theme mt-2">Save</button>
			</div>
		</div>
	</div>
</form>

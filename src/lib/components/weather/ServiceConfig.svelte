<script lang="ts">
	import { applyAction, enhance } from '$app/forms';

	import type { WeatherServiceConfigData } from '$lib/models/weather';

	export let name: string;
	export let data: WeatherServiceConfigData;

	let useGps = data.config.useGps;
	let useGeo = data.config.useGeo;
</script>

<div class="row overflow-auto">
	<form
		id="form"
		method="POST"
		class="col mt-2"
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
				<label for="selectModemService" class="col-3 col-form-label">Modem</label>
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

		<div class="row mb-2">
			<label for="inputLat" class="col-3 col-form-label">Latitude</label>
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
			<label for="inputLng" class="col-3 col-form-label">Longitude</label>
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
			<label for="inputMinDiff" class="col-3 col-form-label">Min Diff</label>
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
			<label for="inputApiKey" class="col-3 col-form-label">API key</label>
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
			<label for="inputItemsPerPage" class="col-3 col-form-label">Items per page</label>
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
	</form>
</div>

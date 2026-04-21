<script lang="ts">
	import { applyAction, enhance } from '$app/forms';

	import CacheTime from '../cache-time.svelte';

	let { name }: { name: string } = $props();
</script>

<ul class="nav nav-tabs">
	<li class="nav-item me-1">
		<a href="#general" class="nav-link active" data-bs-toggle="tab">General</a>
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
			<label for="inputLat" class="col-form-label col-4">Latitude</label>
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
			<label for="inputLng" class="col-form-label col-4">Longitude</label>
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
			<label for="inputMinDiff" class="col-form-label col-4">Min Diff</label>
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
			<label for="inputApiKey" class="col-form-label col-4">API key</label>
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
			<label for="inputGoogleKey" class="col-form-label col-4">Google key</label>
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
			<label for="inputItemsPerPage" class="col-form-label col-4">Items per page</label>
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
				<button type="submit" class="btn-theme btn mt-2">Save</button>
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
				<button type="submit" class="btn-theme btn mt-2">Save</button>
			</div>
		</div>
	</div>
</form>

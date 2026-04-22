<script lang="ts">
	import { configForm, getConfig } from '$lib/weather.remote';

	import CacheTime from '../cache-time.svelte';
	import ErrorCard from '../error-card.svelte';
	import Loader from '../loader.svelte';

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

{#await getConfig(name)}
	<Loader />
{:then config}
	<form id="form" class="tab-content flex-1 pt-3" {...configForm}>
		<input {...configForm.fields.srv.as('hidden', name)} />

		<div class="tab-pane container-fluid fade show active" id="general">
			<div class="row mb-2">
				<label for="inputLat" class="col-form-label col-4">Latitude</label>
				<div class="col">
					<input
						id="inputLat"
						step="any"
						class="form-control"
						{...configForm.fields.lat.as('number', config.lat)}
					/>
				</div>
			</div>

			<div class="row mb-2">
				<label for="inputLng" class="col-form-label col-4">Longitude</label>
				<div class="col">
					<input
						id="inputLng"
						step="any"
						class="form-control"
						{...configForm.fields.lng.as('number', config.lng)}
					/>
				</div>
			</div>

			<div class="row mb-2">
				<label for="inputMinDiff" class="col-form-label col-4">Min Diff</label>
				<div class="col">
					<input
						id="inputMinDiff"
						class="form-control"
						{...configForm.fields.minDiff.as('number', config.minDiff)}
					/>
				</div>
			</div>

			<div class="row mb-2">
				<label for="inputApiKey" class="col-form-label col-4">API key</label>
				<div class="col">
					<input
						id="inputApiKey"
						class="form-control"
						{...configForm.fields.apiKey.as('password', config.apiKey)}
					/>
				</div>
			</div>

			<div class="row mb-2">
				<label for="inputGoogleKey" class="col-form-label col-4">Google key</label>
				<div class="col">
					<input
						id="inputGoogleKey"
						class="form-control"
						{...configForm.fields.googleKey.as('password', config.googleKey)}
					/>
				</div>
			</div>

			<div class="row mb-2">
				<label for="inputItemsPerPage" class="col-form-label col-4">Items per page</label>
				<div class="col">
					<input
						id="inputItemsPerPage"
						min="1"
						max="100"
						step="1"
						class="form-control"
						{...configForm.fields.itemsPerPage.as('number', config.itemsPerPage)}
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
			<CacheTime errorCacheTime={config.errorCacheTime} resultCacheTime={config.resultCacheTime} />

			<div class="row justify-content-end">
				<div class="col-auto">
					<button type="submit" class="btn-theme btn mt-2">Save</button>
				</div>
			</div>
		</div>
	</form>
{:catch err}
	<ErrorCard message="Error loading config" params={err} />
{/await}

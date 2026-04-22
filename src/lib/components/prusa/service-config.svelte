<script lang="ts">
	import { configForm, getConfig } from '$lib/prusa.remote';

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
				<label for="inputApiUrl" class="col-3 col-form-label">API URL</label>
				<div class="col">
					<input
						id="inputApiUrl"
						class="form-control"
						{...configForm.fields.apiUrl.as('text', config.apiUrl)}
					/>
				</div>
			</div>

			<div class="row mb-2">
				<label for="inputApiKey" class="col-3 col-form-label">API key</label>
				<div class="col">
					<input
						id="inputApiKey"
						class="form-control"
						{...configForm.fields.apiKey.as('password', config.apiKey)}
					/>
				</div>
			</div>

			<div class="row justify-content-end">
				<div class="col-auto">
					<button type="submit" class="btn btn-theme mt-2">Save</button>
				</div>
			</div>
		</div>

		<div class="tab-pane container-fluid fade" id="cache">
			<CacheTime errorCacheTime={config.errorCacheTime} resultCacheTime={config.resultCacheTime} />

			<div class="row justify-content-end">
				<div class="col-auto">
					<button type="submit" class="btn btn-theme mt-2">Save</button>
				</div>
			</div>
		</div>
	</form>
{:catch err}
	<ErrorCard message="Error loading config" params={err} />
{/await}

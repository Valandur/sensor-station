<script lang="ts">
	import { applyAction, enhance } from '$app/forms';

	import type { SbbAlertsServiceConfigData } from '$lib/models/sbb-alerts';

	import CacheTime from '../CacheTime.svelte';

	export let data: SbbAlertsServiceConfigData;
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
			<label for="inputApiKey" class="col-3 col-form-label">API Key</label>
			<div class="col">
				<input
					id="inputApiKey"
					type="password"
					name="apiKey"
					value={data.config.apiKey ?? ''}
					class="form-control"
				/>
			</div>
		</div>

		<div class="row mb-2">
			<label for="inputWords" class="col-3 col-form-label">Words</label>
			<div class="col">
				<textarea
					id="inputWords"
					name="words"
					value={data.config.words?.join('\n') ?? ''}
					class="form-control"
					rows="5"
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

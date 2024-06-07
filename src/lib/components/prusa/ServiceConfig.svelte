<script lang="ts">
	import { applyAction, enhance } from '$app/forms';

	import type { PrusaServiceConfig } from '$lib/models/prusa';

	export let name: string;
	export let config: PrusaServiceConfig;
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
		<label for="inputApiUrl" class="col-3 col-form-label">API URL</label>
		<div class="col">
			<input
				id="inputApiUrl"
				type="text"
				name="apiUrl"
				value={config.apiUrl ?? ''}
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

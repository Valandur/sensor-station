<script lang="ts">
	import { applyAction, enhance } from '$app/forms';

	import type { SbbDeparturesServiceConfig } from '$lib/models/sbb-departures';

	export let name: string;
	export let config: SbbDeparturesServiceConfig;
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
		<label for="inputApiKey" class="col-3 col-form-label">API Key</label>
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

	<div class="row mb-2">
		<label for="inputStopPoint" class="col-3 col-form-label">Stop Point</label>
		<div class="col">
			<input
				id="inputStopPoint"
				type="text"
				name="stopPoint"
				value={config.stopPoint ?? ''}
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

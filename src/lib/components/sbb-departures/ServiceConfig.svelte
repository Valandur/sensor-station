<script lang="ts">
	import { applyAction, enhance } from '$app/forms';

	import type { SbbDeparturesServiceConfigData } from '$lib/models/sbb-departures';

	export let name: string;
	export let data: SbbDeparturesServiceConfigData;
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
			<label for="inputStopPoint" class="col-3 col-form-label">Stop Point</label>
			<div class="col">
				<input
					id="inputStopPoint"
					type="text"
					name="stopPoint"
					value={data.config.stopPoint ?? ''}
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

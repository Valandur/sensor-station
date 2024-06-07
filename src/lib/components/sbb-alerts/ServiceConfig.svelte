<script lang="ts">
	import { applyAction, enhance } from '$app/forms';

	import type { SbbAlertsServiceConfig } from '$lib/models/sbb-alerts';

	export let name: string;
	export let config: SbbAlertsServiceConfig;
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
		<label for="inputWords" class="col-3 col-form-label">Words</label>
		<div class="col">
			<textarea
				id="inputWords"
				name="words"
				value={config.words?.join('\n') ?? ''}
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
</form>

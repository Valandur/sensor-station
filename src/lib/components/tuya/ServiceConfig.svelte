<script lang="ts">
	import { applyAction, enhance } from '$app/forms';

	import type { TuyaServiceConfig } from '$lib/models/tuya';

	export let name: string;
	export let config: TuyaServiceConfig;
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
		<label for="inputClientId" class="col-3 col-form-label">Client ID</label>
		<div class="col">
			<input
				id="inputClientId"
				type="text"
				name="clientId"
				value={config.clientId ?? ''}
				class="form-control"
			/>
		</div>
	</div>

	<div class="row mb-2">
		<label for="inputClientSecret" class="col-3 col-form-label">Client Secret</label>
		<div class="col">
			<input
				id="inputClientSecret"
				type="password"
				name="clientSecret"
				value={config.clientSecret ?? ''}
				class="form-control"
			/>
		</div>
	</div>

	<div class="row mb-2">
		<label for="inputDeviceIp" class="col-3 col-form-label">Device IP</label>
		<div class="col">
			<input
				id="inputDeviceIp"
				type="text"
				name="deviceIp"
				value={config.deviceIp ?? ''}
				class="form-control"
			/>
		</div>
	</div>

	<div class="row mb-2">
		<label for="inputProtocolVersion" class="col-3 col-form-label">Protocol Version</label>
		<div class="col">
			<input
				id="inputProtocolVersion"
				type="text"
				name="protocolVersion"
				value={config.protocolVersion ?? ''}
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

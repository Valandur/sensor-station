<script lang="ts">
	import { applyAction, enhance } from '$app/forms';

	import type { TuyaServiceConfigData } from '$lib/models/tuya';

	import CacheTime from '../CacheTime.svelte';

	export let name: string;
	export let data: TuyaServiceConfigData;
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
	<input type="hidden" name="name" value={name} />

	<div class="tab-pane container-fluid fade show active" id="general">
		<div class="row mb-2">
			<label for="inputClientId" class="col-3 col-form-label">Client ID</label>
			<div class="col">
				<input
					id="inputClientId"
					type="text"
					name="clientId"
					value={data.config.clientId}
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
					value={data.config.clientSecret}
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
					value={data.config.deviceIp}
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
					value={data.config.protocolVersion}
					class="form-control"
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

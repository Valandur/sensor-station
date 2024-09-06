<script lang="ts">
	import { applyAction, enhance } from '$app/forms';

	import type { ModemServiceConfigData } from '$lib/models/modem';

	import CacheTime from '../CacheTime.svelte';

	export let data: ModemServiceConfigData;
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
			<label for="inputDevicePath" class="col-3 col-form-label">Device Path</label>
			<div class="col">
				<input
					id="inputDevicePath"
					type="text"
					name="devicePath"
					value={data.config.devicePath}
					class="form-control"
				/>
			</div>
		</div>

		<div class="row mb-2">
			<label for="inputBaudRate" class="col-3 col-form-label">Baud rate</label>
			<div class="col">
				<input
					id="inputBaudRate"
					type="number"
					name="baudRaute"
					value={data.config.baudRate}
					class="form-control"
				/>
			</div>
		</div>

		<div class="row mb-2">
			<label for="inputPauseTime" class="col-3 col-form-label">Pause time</label>
			<div class="col">
				<input
					id="inputPauseTime"
					type="number"
					name="pauseTime"
					value={data.config.pauseTime}
					class="form-control"
				/>
			</div>
		</div>

		<div class="row mb-2">
			<label for="inputWaitTime" class="col-3 col-form-label">Wait time</label>
			<div class="col">
				<input
					id="inputWaitTime"
					type="number"
					name="waitTime"
					value={data.config.waitTime}
					class="form-control"
				/>
			</div>
		</div>

		<div class="row mb-2">
			<label for="inputCmdTimeout" class="col-3 col-form-label">CMD timeout</label>
			<div class="col">
				<input
					id="inputCmdTimeout"
					type="number"
					name="cmdTimeout"
					value={data.config.cmdTimeout}
					class="form-control"
				/>
			</div>
		</div>

		<div class="row mb-2">
			<label for="inputGoogleApiKey" class="col-3 col-form-label">Google API Key</label>
			<div class="col">
				<input
					id="inputGoogleApiKey"
					type="password"
					name="googleApiKey"
					value={data.config.googleApiKey}
					class="form-control"
				/>
			</div>
		</div>

		<div class="row mb-2">
			<label for="inputUnwiredToken" class="col-3 col-form-label">Unwired Token</label>
			<div class="col">
				<input
					id="inputUnwiredToken"
					type="password"
					name="unwiredToken"
					value={data.config.unwiredToken}
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

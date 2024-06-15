<script lang="ts">
	import { applyAction, enhance } from '$app/forms';

	import type { ModemServiceConfigData } from '$lib/models/modem';

	export let name: string;
	export let data: ModemServiceConfigData;
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
	</form>
</div>

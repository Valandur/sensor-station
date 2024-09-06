<script lang="ts">
	import { applyAction, enhance } from '$app/forms';

	import type { DhtSensorServiceConfigData } from '$lib/models/dht-sensor';

	import CacheTime from '../CacheTime.svelte';

	export let data: DhtSensorServiceConfigData;
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
			<label for="inputDevicePath" class="col-4 col-form-label">Device path</label>
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
			<label for="inputDhtPin" class="col-4 col-form-label">DHT Pin</label>
			<div class="col">
				<input
					id="inputDhtPin"
					type="number"
					name="dhtPin"
					step="1"
					value={data.config.dhtPin}
					class="form-control"
				/>
			</div>
		</div>

		<div class="row mb-2">
			<label for="inputDhtType" class="col-4 col-form-label">DHT Type</label>
			<div class="col">
				<input
					id="inputDhtType"
					type="number"
					name="dhtType"
					step="1"
					value={data.config.dhtType}
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

<script lang="ts">
	import { applyAction, enhance } from '$app/forms';

	import type { BatteryServiceConfigData } from '$lib/models/battery';

	import CacheTime from '../CacheTime.svelte';

	export let data: BatteryServiceConfigData;
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
			<label for="inputBusNumber" class="col-4 col-form-label">BUS Number</label>
			<div class="col">
				<input
					id="inputBusNumber"
					type="number"
					name="busNumber"
					value={data.config.busNumber}
					class="form-control"
				/>
			</div>
		</div>

		<div class="row mb-2">
			<label for="inputI2CAddress" class="col-4 col-form-label">I2C Address</label>
			<div class="col">
				<input
					id="inputI2CAddress"
					type="number"
					name="i2cAddress"
					value={data.config.i2cAddress}
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

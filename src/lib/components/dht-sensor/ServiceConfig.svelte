<script lang="ts">
	import { applyAction, enhance } from '$app/forms';

	import type { DhtSensorServiceConfigData } from '$lib/models/dht-sensor';

	export let name: string;
	export let data: DhtSensorServiceConfigData;
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
			<label for="inputDevicePath" class="col-3 col-form-label">Device path</label>
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
			<label for="inputDhtPin" class="col-3 col-form-label">DHT Pin</label>
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
			<label for="inputDhtType" class="col-3 col-form-label">DHT Type</label>
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
	</form>
</div>

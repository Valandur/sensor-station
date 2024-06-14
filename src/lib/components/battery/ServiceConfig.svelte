<script lang="ts">
	import { applyAction, enhance } from '$app/forms';

	import type { BatteryServiceConfigData } from '$lib/models/battery';

	export let name: string;
	export let data: BatteryServiceConfigData;
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
			<label for="inputBusNumber" class="col-3 col-form-label">BUS Number</label>
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
			<label for="inputI2CAddress" class="col-3 col-form-label">I2C Address</label>
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
	</form>
</div>

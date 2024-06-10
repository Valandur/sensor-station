<script lang="ts">
	import { applyAction, enhance } from '$app/forms';

	import type { CarouselServiceConfig } from '$lib/models/carousel';

	export let name: string;
	export let config: CarouselServiceConfig;
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
		<label for="inputSwitchInterval" class="col-3 col-form-label">Switch Interval</label>
		<div class="col">
			<input
				id="inputSwitchInterval"
				type="number"
				name="switchInterval"
				value={config.switchInterval ?? '20'}
				class="form-control"
			/>
		</div>
	</div>

	<div class="row mb-2">
		<label for="inputUpdateInterval" class="col-3 col-form-label">Update Interval</label>
		<div class="col">
			<input
				id="inputUpdateInterval"
				type="number"
				name="updateInterval"
				value={config.updateInterval ?? '60'}
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

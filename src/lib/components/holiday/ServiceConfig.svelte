<script lang="ts">
	import { applyAction, enhance } from '$app/forms';

	import type { HolidayServiceConfigData } from '$lib/models/holiday';

	export let name: string;
	export let data: HolidayServiceConfigData;
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
			<label for="inputCountry" class="col-3 col-form-label">Country</label>
			<div class="col">
				<input
					id="inputCountry"
					type="text"
					name="country"
					value={data.config.country}
					class="form-control"
				/>
			</div>
		</div>

		<div class="row mb-2">
			<label for="inputState" class="col-3 col-form-label">State</label>
			<div class="col">
				<input
					id="inputState"
					type="text"
					name="state"
					value={data.config.state}
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

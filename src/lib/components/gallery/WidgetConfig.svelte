<script lang="ts">
	import { applyAction, enhance } from '$app/forms';

	import type { GalleryWidgetConfigData } from '$lib/models/gallery';

	export let name: string;
	export let data: GalleryWidgetConfigData;
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
			<label for="inputService" class="col-3 col-form-label">Service</label>
			<div class="col">
				<select id="inputService" name="service" class="form-select" value={data.config.service}>
					{#each data.services as service}
						<option value={service.name}>{service.name}</option>
					{/each}
				</select>
			</div>
		</div>

		<div class="row justify-content-end">
			<div class="col-auto">
				<button type="submit" class="btn btn-theme mt-2">Save</button>
			</div>
		</div>
	</form>
</div>

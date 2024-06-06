<script lang="ts">
	import { applyAction, enhance } from '$app/forms';

	import type { ServiceInstance } from '$lib/models/service';
	import { CALENDAR_SERVICE_TYPE, type CalendarWidgetConfig } from '$lib/models/calendar';

	export let name: string;
	export let config: CalendarWidgetConfig;
	export let services: ServiceInstance[];

	$: validServices = services.filter((s) => s.type === CALENDAR_SERVICE_TYPE);
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
		<label for="inputService" class="col-3 col-form-label">Service</label>
		<div class="col">
			<select id="inputService" name="serviceName" class="form-select" value={config.serviceName}>
				{#each validServices as srv}
					<option value={srv.name}>{srv.name}</option>
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

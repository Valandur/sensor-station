<script lang="ts">
	import { applyAction, enhance } from '$app/forms';

	import type { ServiceInstance } from '$lib/models/service';
	import { WEATHER_SERVICE_TYPE, type WeatherWidgetConfig } from '$lib/models/weather';

	export let name: string;
	export let config: WeatherWidgetConfig;
	export let services: ServiceInstance[];

	$: validServices = services.filter((s) => s.type === WEATHER_SERVICE_TYPE);
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
		<label for="inputType" class="col-3 col-form-label">Type</label>
		<div class="col">
			<select id="inputType" name="type" class="form-select" value={config.type}>
				<option value="" selected disabled>---</option>
				<option value="daily">Daily</option>
				<option value="hourly">Hourly</option>
				<option value="alerts">Alerts</option>
			</select>
		</div>
	</div>

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

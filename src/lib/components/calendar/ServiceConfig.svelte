<script lang="ts">
	import { applyAction, enhance } from '$app/forms';

	import type { CalendarServiceConfigData } from '$lib/models/calendar';

	export let name: string;
	export let data: CalendarServiceConfigData;
</script>

<form
	id="form"
	method="POST"
	class="mt-2"
	use:enhance={() =>
		({ result }) =>
			applyAction(result)}
>
	<input type="hidden" name="name" value={name} />

	<div class="row mb-2">
		<label for="inputCalendarId" class="col-3 col-form-label">Calendar ID</label>
		<div class="col">
			<input
				id="inputCalendarId"
				type="text"
				name="calendarId"
				value={data.config.calendarId ?? ''}
				class="form-control"
			/>
		</div>
	</div>

	<div class="row mb-2">
		<label for="inputServiceEmail" class="col-3 col-form-label">Service E-Mail</label>
		<div class="col">
			<input
				id="inputServiceEmail"
				type="text"
				name="serviceEmail"
				value={data.config.serviceEmail ?? ''}
				class="form-control"
			/>
		</div>
	</div>

	<div class="row mb-2">
		<label for="inputPrivateKey" class="col-3 col-form-label">Private Key</label>
		<div class="col">
			<textarea
				id="inputPrivateKey"
				name="privateKey"
				value={data.config.privateKey ?? ''}
				class="form-control"
				rows="3"
			/>
		</div>
	</div>

	<div class="row justify-content-end">
		<div class="col-auto">
			<button type="submit" class="btn btn-theme mt-2">Save</button>
		</div>
	</div>
</form>

<script lang="ts">
	import { applyAction, enhance } from '$app/forms';

	import type { CalendarServiceConfigData } from '$lib/models/calendar';

	import CacheTime from '../CacheTime.svelte';

	export let name: string;
	export let data: CalendarServiceConfigData;
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
	<input type="hidden" name="name" value={name} />

	<div class="tab-pane container-fluid fade show active" id="general">
		<div class="row mb-2">
			<label for="inputCalendarId" class="col-4 col-form-label">Calendar ID</label>
			<div class="col">
				<input
					id="inputCalendarId"
					type="text"
					name="calendarId"
					value={data.config.calendarId}
					class="form-control"
				/>
			</div>
		</div>

		<div class="row mb-2">
			<label for="inputServiceEmail" class="col-4 col-form-label">Service E-Mail</label>
			<div class="col">
				<input
					id="inputServiceEmail"
					type="text"
					name="serviceEmail"
					value={data.config.serviceEmail}
					class="form-control"
				/>
			</div>
		</div>

		<div class="row mb-2">
			<label for="inputPrivateKey" class="col-4 col-form-label">Private Key</label>
			<div class="col">
				<textarea
					id="inputPrivateKey"
					name="privateKey"
					value={data.config.privateKey}
					class="form-control"
					rows="3"
				/>
			</div>
		</div>

		<div class="row mb-2">
			<label for="inputItemsPerPage" class="col-4 col-form-label">Items per page</label>
			<div class="col">
				<input
					id="inputItemsPerPage"
					type="number"
					name="itemsPerPage"
					min="1"
					max="100"
					step="1"
					value={data.config.itemsPerPage}
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

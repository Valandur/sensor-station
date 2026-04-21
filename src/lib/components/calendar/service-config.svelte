<script lang="ts">
	import { configForm, getConfig } from '$lib/calendar.remote';

	import CacheTime from '../cache-time.svelte';

	let { name }: { name: string } = $props();

	let data = $derived(getConfig(name).current);
</script>

<ul class="nav nav-tabs">
	<li class="nav-item me-1">
		<a href="#general" class="nav-link active" data-bs-toggle="tab">General</a>
	</li>
	<li class="nav-item me-1">
		<a href="#cache" class="nav-link" data-bs-toggle="tab">Cache</a>
	</li>
</ul>

<form id="form" class="tab-content flex-1 pt-3" {...configForm}>
	<input {...configForm.fields.srv.as('hidden', name)} />

	<div class="tab-pane container-fluid fade show active" id="general">
		<div class="row mb-2">
			<label for="inputCalendarId" class="col-form-label col-4">Calendar ID</label>
			<div class="col">
				<input
					id="inputCalendarId"
					class="form-control"
					{...configForm.fields.calendarId.as('text', data?.config.calendarId ?? '')}
				/>
			</div>
		</div>

		<div class="row mb-2">
			<label for="inputServiceEmail" class="col-form-label col-4">Service E-Mail</label>
			<div class="col">
				<input
					id="inputServiceEmail"
					class="form-control"
					{...configForm.fields.serviceEmail.as('text', data?.config.serviceEmail ?? '')}
				/>
			</div>
		</div>

		<div class="row mb-2">
			<label for="inputPrivateKey" class="col-form-label col-4">Private Key</label>
			<div class="col">
				<textarea
					id="inputPrivateKey"
					class="form-control"
					rows="3"
					{...configForm.fields.privateKey.as('text', data?.config.privateKey ?? '')}
				></textarea>
			</div>
		</div>

		<div class="row mb-2">
			<label for="inputItemsPerPage" class="col-form-label col-4">Items per page</label>
			<div class="col">
				<input
					id="inputItemsPerPage"
					min="1"
					max="100"
					step="1"
					class="form-control"
					{...configForm.fields.itemsPerPage.as('number', data?.config.itemsPerPage ?? 0)}
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
			errorCacheTime={data?.config.errorCacheTime}
			resultCacheTime={data?.config.resultCacheTime}
		/>

		<div class="row justify-content-end">
			<div class="col-auto">
				<button type="submit" class="btn btn-theme mt-2">Save</button>
			</div>
		</div>
	</div>
</form>

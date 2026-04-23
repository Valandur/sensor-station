<script lang="ts">
	import { configForm, getConfig } from '$lib/calendar.remote';

	import CacheTime from '../cache-time.svelte';
	import ErrorCard from '../error-card.svelte';
	import Loader from '../loader.svelte';

	let { name }: { name: string } = $props();
</script>

<ul class="nav nav-tabs">
	<li class="nav-item me-1">
		<a href="#general" class="nav-link active" data-bs-toggle="tab">General</a>
	</li>
	<li class="nav-item me-1">
		<a href="#cache" class="nav-link" data-bs-toggle="tab">Cache</a>
	</li>
</ul>

{#await getConfig(name)}
	<Loader />
{:then config}
	<form id="form" class="tab-content flex-1 pt-3" {...configForm}>
		<input {...configForm.fields.srv.as('hidden', name)} />

		<div class="tab-pane container-fluid fade show active" id="general">
			<div class="row mb-2">
				<label for="inputCalendarId" class="col-form-label col-4">Calendar ID</label>
				<div class="col">
					<input
						id="inputCalendarId"
						class="form-control"
						{...configForm.fields.calendarId.as('text', config.calendarId ?? '')}
					/>
				</div>
			</div>

			<div class="row mb-2">
				<label for="inputServiceEmail" class="col-form-label col-4">Service E-Mail</label>
				<div class="col">
					<input
						id="inputServiceEmail"
						class="form-control"
						{...configForm.fields.serviceEmail.as('text', config.serviceEmail ?? '')}
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
						{...configForm.fields.privateKey.as('text', config.privateKey ?? '')}
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
						{...configForm.fields.itemsPerPage.as('number', config.itemsPerPage ?? 0)}
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
			<CacheTime errorCacheTime={config.errorCacheTime} resultCacheTime={config.resultCacheTime} />

			<div class="row justify-content-end">
				<div class="col-auto">
					<button type="submit" class="btn btn-theme mt-2">Save</button>
				</div>
			</div>
		</div>
	</form>
{:catch err}
	<ErrorCard message="Error loading config" params={err} />
{/await}

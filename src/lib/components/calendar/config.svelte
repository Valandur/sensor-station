<script lang="ts">
	import { configForm, getConfig } from '$lib/calendar.remote';

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

<svelte:boundary>
	{@const config = await getConfig(name)}

	<form
		id="form"
		class="tab-content flex-1 pt-3"
		{...configForm.enhance(({ submit }) => submit())}
		onchange={() => configForm.validate()}
		novalidate
	>
		<input {...configForm.fields.srv.as('hidden', name)} />

		<div class="tab-pane container-fluid fade show active" id="general">
			<div class="row mb-2">
				<label for="inputCalendarId" class="col-form-label col-4">Calendar ID</label>
				<div class="col">
					<div class="input-group">
						<input
							id="inputCalendarId"
							class="form-control"
							class:is-invalid={!!configForm.fields.calendarId.issues()}
							class:is-valid={!configForm.fields.calendarId.issues()}
							{...configForm.fields.calendarId.as('text', config.calendarId)}
						/>
						{#each configForm.fields.calendarId.issues() as issue, i (i)}
							<div class="invalid-tooltip">{issue.message}</div>
						{/each}
					</div>
				</div>
			</div>

			<div class="row mb-2">
				<label for="inputServiceEmail" class="col-form-label col-4">Service E-Mail</label>
				<div class="col">
					<div class="input-group">
						<input
							id="inputServiceEmail"
							class="form-control"
							class:is-invalid={!!configForm.fields.serviceEmail.issues()}
							class:is-valid={!configForm.fields.serviceEmail.issues()}
							{...configForm.fields.serviceEmail.as('email', config.serviceEmail)}
						/>
						{#each configForm.fields.serviceEmail.issues() as issue, i (i)}
							<div class="invalid-tooltip">{issue.message}</div>
						{/each}
					</div>
				</div>
			</div>

			<div class="row mb-2">
				<label for="inputPrivateKey" class="col-form-label col-4">Private Key</label>
				<div class="col">
					<div class="input-group">
						<textarea
							id="inputPrivateKey"
							class="form-control"
							rows="3"
							class:is-invalid={!!configForm.fields.privateKey.issues()}
							class:is-valid={!configForm.fields.privateKey.issues()}
							{...configForm.fields.privateKey.as('text', config.privateKey)}
						></textarea>
						{#each configForm.fields.privateKey.issues() as issue, i (i)}
							<div class="invalid-tooltip">{issue.message}</div>
						{/each}
					</div>
				</div>
			</div>

			<div class="row mb-2">
				<label for="inputItemsPerPage" class="col-form-label col-4">Items per page</label>
				<div class="col">
					<div class="input-group">
						<input
							id="inputItemsPerPage"
							min="1"
							max="10"
							step="1"
							class="form-control"
							class:is-invalid={!!configForm.fields.itemsPerPage.issues()}
							class:is-valid={!configForm.fields.itemsPerPage.issues()}
							{...configForm.fields.itemsPerPage.as('number', config.itemsPerPage)}
						/>
						{#each configForm.fields.itemsPerPage.issues() as issue, i (i)}
							<div class="invalid-tooltip">{issue.message}</div>
						{/each}
					</div>
				</div>
			</div>

			<div class="row justify-content-end">
				<div class="col-auto">
					<button
						type="submit"
						class="btn btn-theme mt-2"
						disabled={configForm.pending > 0 || !!configForm.fields.allIssues()?.length}
					>
						Save
					</button>
				</div>
			</div>
		</div>

		<div class="tab-pane container-fluid fade" id="cache">
			<div class="row mb-2">
				<label for="inputResult" class="col-form-label col-4">Result cache time (seconds)</label>
				<div class="col">
					<div class="input-group">
						<input
							id="inputResult"
							step="any"
							class="form-control"
							class:is-invalid={!!configForm.fields.resultCacheTime.issues()}
							class:is-valid={!configForm.fields.resultCacheTime.issues()}
							{...configForm.fields.resultCacheTime.as('number', config.resultCacheTime ?? 0)}
						/>
						{#each configForm.fields.resultCacheTime.issues() as issue, i (i)}
							<div class="invalid-tooltip">{issue.message}</div>
						{/each}
					</div>
				</div>
			</div>

			<div class="row mb-2">
				<label for="inputLat" class="col-form-label col-4">Error cache time (seconds)</label>
				<div class="col">
					<div class="input-group">
						<input
							id="inputError"
							step="any"
							class="form-control"
							class:is-invalid={!!configForm.fields.errorCacheTime.issues()}
							class:is-valid={!configForm.fields.errorCacheTime.issues()}
							{...configForm.fields.errorCacheTime.as('number', config.errorCacheTime ?? 0)}
						/>
						{#each configForm.fields.errorCacheTime.issues() as issue, i (i)}
							<div class="invalid-tooltip">{issue.message}</div>
						{/each}
					</div>
				</div>
			</div>

			<div class="row justify-content-end">
				<div class="col-auto">
					<button
						type="submit"
						class="btn btn-theme mt-2"
						disabled={configForm.pending > 0 || !!configForm.fields.allIssues()?.length}
					>
						Save
					</button>
				</div>
			</div>
		</div>
	</form>

	{#snippet pending()}
		<Loader />
	{/snippet}

	{#snippet failed(error)}
		<ErrorCard message="Error loading config" params={{ error }} />
	{/snippet}
</svelte:boundary>

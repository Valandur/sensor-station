<script lang="ts">
	import { configForm, getConfig } from '$lib/srf.remote';

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
				<label for="inputFeedId" class="col-4 col-form-label">Feed ID</label>
				<div class="col">
					<div class="input-group">
						<input
							id="inputFeedId"
							class="form-control"
							class:is-invalid={!!configForm.fields.feedId.issues()}
							class:is-valid={!configForm.fields.feedId.issues()}
							{...configForm.fields.feedId.as('text', config.feedId)}
						/>
						{#each configForm.fields.feedId.issues() as issue, i (i)}
							<div class="invalid-tooltip">{issue.message}</div>
						{/each}
					</div>
				</div>
			</div>

			<div class="row mb-2">
				<div class="col-4"></div>
				<div class="col">
					<table class="table table-sm">
						<thead class="table-dark">
							<tr>
								<th>Kategorie</th>
								<th>Feed ID</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>Allgemein</td>
								<td>1646</td>
							</tr>
							<tr>
								<td>Sport</td>
								<td>718</td>
							</tr>
							<tr>
								<td>Kultur</td>
								<td>454</td>
							</tr>
							<tr>
								<td>Wissen</td>
								<td>630</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>

			<div class="row mb-2">
				<div class="col">
					<div class="input-group">
						<div class="form-check form-switch">
							<input
								class="form-check-input"
								id="switchSimpleDetails"
								defaultChecked={config.simpleDetails}
								{...configForm.fields.simpleDetails.as('checkbox')}
							/>
							<label class="form-check-label" for="switchSimpleDetails">Simple details</label>
						</div>
						{#each configForm.fields.simpleDetails.issues() as issue, i (i)}
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

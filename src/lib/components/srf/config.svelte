<script lang="ts">
	import { configForm, getConfig } from '$lib/srf.remote';

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
				<label for="inputFeedId" class="col-3 col-form-label">Feed ID</label>
				<div class="col">
					<input
						id="inputFeedId"
						class="form-control"
						{...configForm.fields.feedId.as('text', config.feedId)}
					/>
				</div>
			</div>

			<div class="row mb-2">
				<div class="col-3"></div>
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
					<div class="form-check form-switch">
						<input
							class="form-check-input"
							id="switchSimpleDetails"
							defaultChecked={config.simpleDetails}
							{...configForm.fields.simpleDetails.as('checkbox')}
						/>
						<label class="form-check-label" for="switchSimpleDetails">Simple details</label>
					</div>
				</div>
			</div>

			<div class="row mb-2">
				<label for="inputItemsPerPage" class="col-3 col-form-label">Items per page</label>
				<div class="col">
					<input
						id="inputItemsPerPage"
						min="1"
						max="100"
						step="1"
						class="form-control"
						{...configForm.fields.itemsPerPage.as('number', config.itemsPerPage)}
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

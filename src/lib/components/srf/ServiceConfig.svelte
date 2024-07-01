<script lang="ts">
	import { applyAction, enhance } from '$app/forms';

	import type { SrfServiceConfigData } from '$lib/models/srf';

	import CacheTime from '../CacheTime.svelte';

	export let name: string;
	export let data: SrfServiceConfigData;
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
			<label for="inputFeedId" class="col-3 col-form-label">Feed ID</label>
			<div class="col">
				<input
					id="inputFeedId"
					type="text"
					name="feedId"
					value={data.config.feedId ?? ''}
					class="form-control"
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
			<label for="inputItemsPerPage" class="col-3 col-form-label">Items per page</label>
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

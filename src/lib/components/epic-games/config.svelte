<script lang="ts">
	import { configForm, getConfig } from '$lib/epic-games.remote';

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

<svelte:boundary>
	{@const config = await getConfig(name)}

	<form id="form" class="tab-content flex-1 pt-3" {...configForm}>
		<input {...configForm.fields.srv.as('hidden', name)} />

		<div class="tab-pane container-fluid fade show active" id="general">
			<div class="row mb-2">
				<label for="inputItemsPerPage" class="col-form-label col-3">Items per page</label>
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

	{#snippet pending()}
		<Loader />
	{/snippet}

	{#snippet failed(error)}
		<ErrorCard message="Error loading config" params={{ error }} />
	{/snippet}
</svelte:boundary>

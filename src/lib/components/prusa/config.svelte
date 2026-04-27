<script lang="ts">
	import { configForm, getConfig } from '$lib/prusa.remote';

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
				<label for="inputApiUrl" class="col-3 col-form-label">API URL</label>
				<div class="col">
					<div class="input-group">
						<input
							id="inputApiUrl"
							class="form-control"
							class:is-invalid={!!configForm.fields.apiUrl.issues()}
							class:is-valid={!configForm.fields.apiUrl.issues()}
							{...configForm.fields.apiUrl.as('text', config.apiUrl)}
						/>
						{#each configForm.fields.apiUrl.issues() as issue, i (i)}
							<div class="invalid-tooltip">{issue.message}</div>
						{/each}
					</div>
				</div>
			</div>

			<div class="row mb-2">
				<label for="inputApiKey" class="col-3 col-form-label">API key</label>
				<div class="col">
					<div class="input-group">
						<input
							id="inputApiKey"
							class="form-control"
							class:is-invalid={!!configForm.fields.apiKey.issues()}
							class:is-valid={!configForm.fields.apiKey.issues()}
							{...configForm.fields.apiKey.as('password', config.apiKey)}
						/>
						{#each configForm.fields.apiKey.issues() as issue, i (i)}
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

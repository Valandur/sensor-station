<script lang="ts">
	import { applyAction, enhance } from '$app/forms';

	import type { SwissPostServiceConfigData } from '$lib/models/swiss-post';

	import CacheTime from '../CacheTime.svelte';

	export let data: SwissPostServiceConfigData;
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
	<div class="tab-pane container-fluid fade show active" id="general">
		<div class="row mb-2">
			<label for="inputUsername" class="col-3 col-form-label">Username</label>
			<div class="col">
				<input
					id="inputUsername"
					type="text"
					name="username"
					value={data.config.username ?? ''}
					class="form-control"
				/>
			</div>
		</div>

		<div class="row mb-2">
			<label for="inputPassword" class="col-3 col-form-label">Password</label>
			<div class="col">
				<input
					id="inputPassword"
					type="password"
					name="password"
					value={data.config.password ?? ''}
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

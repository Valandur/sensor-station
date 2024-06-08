<script lang="ts">
	import { applyAction, enhance } from '$app/forms';

	import type { PostServiceConfig } from '$lib/models/post';

	export let name: string;
	export let config: PostServiceConfig;
</script>

<form
	id="form"
	method="POST"
	action="?/save"
	class="mt-2"
	use:enhance={() =>
		({ result }) =>
			applyAction(result)}
>
	<input type="hidden" name="name" value={name} />

	<div class="row mb-2">
		<label for="inputUsername" class="col-3 col-form-label">Username</label>
		<div class="col">
			<input
				id="inputUsername"
				type="text"
				name="username"
				value={config.username ?? ''}
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
				value={config.password ?? ''}
				class="form-control"
			/>
		</div>
	</div>

	<div class="row justify-content-end">
		<div class="col-auto">
			<button type="submit" class="btn btn-theme mt-2">Save</button>
		</div>
	</div>
</form>

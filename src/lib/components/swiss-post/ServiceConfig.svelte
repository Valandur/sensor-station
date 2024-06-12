<script lang="ts">
	import { applyAction, enhance } from '$app/forms';

	import type { SwissPostServiceConfigData } from '$lib/models/swiss-post';

	export let name: string;
	export let data: SwissPostServiceConfigData;
</script>

<div class="row overflow-auto">
	<form
		id="form"
		method="POST"
		class="col mt-2"
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
	</form>
</div>

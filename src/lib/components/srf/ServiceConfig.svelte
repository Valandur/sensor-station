<script lang="ts">
	import { applyAction, enhance } from '$app/forms';

	import type { SrfServiceConfig } from '$lib/models/srf';

	export let name: string;
	export let config: SrfServiceConfig;
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
		<label for="inputFeedId" class="col-3 col-form-label">Feed ID</label>
		<div class="col">
			<input
				id="inputFeedId"
				type="text"
				name="feedId"
				value={config.feedId ?? ''}
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

	<div class="row justify-content-end">
		<div class="col-auto">
			<button type="submit" class="btn btn-theme mt-2">Save</button>
		</div>
	</div>
</form>

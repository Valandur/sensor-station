<script lang="ts">
	import { enhance } from '$app/forms';

	import PageLayout from '$lib/components/PageLayout.svelte';

	import type { PageData } from './$types';

	export let data: PageData;
	$: types = data.types;
	$: widgets = data.widgets;

	let newName = '';
	let newType = '';
</script>

<PageLayout title="Widgets">
	<div class="row overflow-auto">
		<div class="col">
			<table class="table">
				<colgroup>
					<col width="50%" />
					<col width="50%" />
					<col />
				</colgroup>

				<tbody>
					<tr>
						<td>
							<input
								form="formNew"
								type="text"
								name="newName"
								placeholder="Name"
								class="form-control"
								bind:value={newName}
							/>
						</td>
						<td>
							<select form="formNew" name="newType" class="form-select" bind:value={newType}>
								<option value="" selected disabled>---</option>
								{#each types as type}
									<option value={type}>{type}</option>
								{/each}
							</select>
						</td>
						<td>
							<form id="formNew" method="POST" action="?/add" use:enhance>
								<button type="submit" class="btn btn-theme" disabled={!newName || !newType}>
									<i class="icofont-ui-add" />
								</button>
							</form>
						</td>
					</tr>

					{#each widgets as widget}
						<tr>
							<td>
								{widget.name}
							</td>
							<td>
								{widget.type}
							</td>
							<td>
								<form method="POST" action="?/delete" use:enhance>
									<input type="hidden" name="name" value={widget.name} />
									<div class="btn-group">
										<a href="/widgets/{widget.name}" class="btn btn-theme">
											<i class="icofont-ui-edit" />
										</a>
										<button class="btn btn-danger">
											<i class="icofont-ui-delete" />
										</button>
									</div>
								</form>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</PageLayout>

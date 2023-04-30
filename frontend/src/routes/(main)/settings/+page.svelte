<script lang="ts">
	import { enhance } from '$app/forms';
	import { SCREEN_NAMES, SCREEN_PARAMS } from '$lib/models/Screen';

	import type { PageData } from './$types';

	export let data: PageData;
	$: screens = data.screens;

	let newName = '';
</script>

<div class="container-fluid m-0 p-1 vh-100 d-flex flex-column">
	<div class="row">
		<div class="col">
			<h1>Settings</h1>
		</div>
		<div class="col-auto">
			<a class="btn btn-sm btn-outline-danger" href="/">
				<i class="icofont-ui-close" />
			</a>
		</div>
	</div>

	<div class="row overflow-auto">
		<div class="col">
			<table class="table table-sm">
				<colgroup>
					<col width="50%" />
					<col width="50%" />
					<col />
					<col />
					<col />
				</colgroup>

				<tbody>
					<tr>
						<td>
							<select
								bind:value={newName}
								form="formNew"
								name="newName"
								class="form-select form-select-sm"
							>
								{#each Object.entries(SCREEN_NAMES) as [value, name]}
									<option {value}>{name}</option>
								{/each}
							</select>
						</td>
						<td>
							{#if newName in SCREEN_PARAMS}
								<select form="formNew" name="newParams" class="form-select form-select-sm">
									{#each Object.entries(SCREEN_PARAMS[newName]) as [value, name]}
										<option {value}>{name}</option>
									{/each}
								</select>
							{:else}
								<input form="formNew" type="hidden" name="newParams" value="" />
							{/if}
						</td>
						<td />
						<td />
						<td>
							<form id="formNew" method="POST" action="?/add" use:enhance>
								<button type="submit" class="btn btn-sm btn-outline-success" disabled={!newName}>
									<i class="icofont-ui-add" />
								</button>
							</form>
						</td>
					</tr>

					{#each screens as screen, i}
						<tr>
							<td>
								{SCREEN_NAMES[screen.name] || screen.name}
							</td>
							<td>
								{SCREEN_PARAMS[screen.name]?.[screen.params] || screen.params}
							</td>
							<td>
								<form id="formNew" method="POST" action="?/move" use:enhance>
									<input type="hidden" name="index" value={i} />
									<input type="hidden" name="dir" value="up" />
									<button
										class="btn btn-sm"
										class:btn-outline-theme={i > 0}
										class:btn-outline-secondary={i === 0}
										disabled={i === 0}
									>
										<i class="icofont-caret-up" />
									</button>
								</form>
							</td>
							<td>
								<form id="formNew" method="POST" action="?/move" use:enhance>
									<input type="hidden" name="index" value={i} />
									<input type="hidden" name="dir" value="down" />
									<button
										class="btn btn-sm"
										class:btn-outline-theme={i < screens.length - 1}
										class:btn-outline-secondary={i === screens.length - 1}
										disabled={i === screens.length - 1}
									>
										<i class="icofont-caret-down" />
									</button>
								</form>
							</td>
							<td>
								<form id="formNew" method="POST" action="?/delete" use:enhance>
									<input type="hidden" name="index" value={i} />
									<button class="btn btn-sm btn-outline-danger">
										<i class="icofont-ui-delete" />
									</button>
								</form>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>

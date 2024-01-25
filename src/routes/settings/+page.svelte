<script lang="ts">
	import { enhance } from '$app/forms';
	import { SCREEN_NAMES, SCREEN_PARAMS } from '$lib/models/Screen';
	import PageLayout from '$lib/components/PageLayout.svelte';

	import type { PageData } from './$types';

	const allScreens = Object.entries(SCREEN_NAMES).sort((a, b) => a[1].localeCompare(b[1]));

	export let data: PageData;
	$: screens = data.screens;

	let newName = '';
</script>

<PageLayout title="Settings">
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
								form="formNew"
								name="newName"
								class="form-select form-select-sm"
								bind:value={newName}
							>
								{#each allScreens as [value, name]}
									<option {value}>{name}</option>
								{/each}
							</select>
						</td>
						<td>
							{#if newName in SCREEN_PARAMS}
								{@const params = Object.entries(SCREEN_PARAMS[newName]).sort((a, b) =>
									a[1].localeCompare(b[1])
								)}
								<select form="formNew" name="newParams" class="form-select form-select-sm">
									{#each params as [value, name]}
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
							<form
								id="formNew"
								method="POST"
								action="?/add"
								use:enhance
								on:submit={() => (newName = '')}
							>
								<button type="submit" class="btn btn-sm btn-success" disabled={!newName}>
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
								<form method="POST" action="?/move" use:enhance>
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
								<form method="POST" action="?/move" use:enhance>
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
								<form method="POST" action="?/delete" use:enhance>
									<input type="hidden" name="index" value={i} />
									<button class="btn btn-sm btn-danger">
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
</PageLayout>

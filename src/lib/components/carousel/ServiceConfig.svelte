<script lang="ts">
	import { enhance } from '$app/forms';

	import type { CarouselServiceConfigData } from '$lib/models/carousel';

	export let name: string;
	export let data: CarouselServiceConfigData;

	$: widgets = data.widgets;
	$: screens = data.config.screens;

	let newName = '';
</script>

<div class="row overflow-auto">
	<div class="col">
		<table class="table">
			<colgroup>
				<col width="100%" />
				<col />
			</colgroup>

			<tbody>
				<tr>
					<td>
						<select form="formNew" name="widget" class="form-select" bind:value={newName}>
							<option value="" selected disabled>---</option>
							{#each widgets as widget}
								<option value={widget.name}>{widget.name} [{widget.type}]</option>
							{/each}
						</select>
					</td>
					<td>
						<form id="formNew" method="POST" use:enhance>
							<input type="hidden" name="name" value={name} />
							<input type="hidden" name="action" value="add" />
							<button type="submit" class="btn btn-theme" disabled={!newName}>
								<i class="icofont-ui-add" />
							</button>
						</form>
					</td>
				</tr>

				{#each screens as screen, index}
					<tr>
						<td>
							{screen.widget}
						</td>
						<td>
							<form method="POST" use:enhance>
								<input type="hidden" name="name" value={name} />
								<input type="hidden" name="action" value="delete" />
								<input type="hidden" name="index" value={index} />
								<div class="btn-group">
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

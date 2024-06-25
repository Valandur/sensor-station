<script lang="ts">
	import { enhance } from '$app/forms';

	import type { CarouselServiceConfigData } from '$lib/models/carousel';

	export let name: string;
	export let data: CarouselServiceConfigData;

	$: services = data.services;
	$: screens = data.config.screens;

	let newName = '';
	let newAction = '';
	let newIcon = '';

	$: actions = services.find((s) => s.name === newName)?.type.actions ?? [];
	$: if (!actions.includes(newAction)) {
		newAction = '';
	}
	$: if (!actions.includes(newIcon)) {
		newIcon = '';
	}
</script>

<div class="row overflow-auto">
	<div class="col">
		<table class="table">
			<colgroup>
				<col width="40%" />
				<col width="25%" />
				<col width="25%" />
				<col />
			</colgroup>

			<thead>
				<tr>
					<th>Service</th>
					<th>Action</th>
					<th>Icon</th>
					<th></th>
				</tr>
			</thead>

			<tbody>
				<tr class="bg-dark">
					<td>
						<select form="formNew" name="service" class="form-select" bind:value={newName}>
							<option value="" selected disabled>---</option>
							{#each services as service}
								<option value={service.name}>{service.name} [{service.type.name}]</option>
							{/each}
						</select>
					</td>
					<td>
						<select form="formNew" name="action" class="form-select" bind:value={newAction}>
							<option value="">---</option>
							{#each actions as action}
								<option value={action}>{action}</option>
							{/each}
						</select>
					</td>
					<td>
						<select form="formNew" name="icon" class="form-select" bind:value={newIcon}>
							<option value="">---</option>
							{#each actions as action}
								<option value={action}>{action}</option>
							{/each}
						</select>
					</td>
					<td>
						<form id="formNew" method="POST" use:enhance>
							<input type="hidden" name="name" value={name} />
							<input type="hidden" name="__formAction" value="add" />
							<button
								type="submit"
								class="btn btn-theme"
								disabled={!newName || (!newAction && !newIcon)}
							>
								<i class="icofont-ui-add" />
							</button>
						</form>
					</td>
				</tr>

				{#each screens as screen, index}
					<tr>
						<td>
							{screen.name}
						</td>
						<td>
							{screen.action ?? '---'}
						</td>
						<td>
							{screen.icon ?? '---'}
						</td>
						<td>
							<form method="POST" use:enhance>
								<input type="hidden" name="name" value={name} />
								<input type="hidden" name="__formAction" value="delete" />
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

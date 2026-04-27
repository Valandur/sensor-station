<script lang="ts">
	import { enhance } from '$app/forms';
	import {
		deleteScreen,
		getConfig,
		holidaysForm,
		moveScreen,
		newScreenForm
	} from '$lib/carousel.remote';

	let { name }: { name: string } = $props();

	let data = $derived(getConfig(name).current);

	let services = $derived(data?.services ?? []);
	let screens = $derived(data?.config.screens ?? []);
	let icons = $derived(data?.config.icons ?? []);

	let newScreenName = $state('');
	let newScreenAction = $state('');
	let newIconName = $state('');
	let newIconAction = $state('');

	let screenActions = $derived(services.find((s) => s.name === newScreenName)?.type.actions ?? []);
	let iconActions = $derived(services.find((s) => s.name === newIconName)?.type.actions ?? []);
</script>

<ul class="nav nav-tabs">
	<li class="nav-item me-1">
		<a href="#screens" class="nav-link active" data-bs-toggle="tab">Screens</a>
	</li>
	<li class="nav-item me-1">
		<a href="#icons" class="nav-link" data-bs-toggle="tab">Icons</a>
	</li>
	<li class="nav-item me-1">
		<a href="#holidays" class="nav-link" data-bs-toggle="tab">Holidays</a>
	</li>
</ul>

<div class="tab-content flex-1 pt-3">
	<div class="tab-pane container-fluid fade show active" id="screens">
		<table class="table">
			<colgroup>
				<col width="45%" />
				<col width="45%" />
				<col />
			</colgroup>

			<tbody>
				<tr class="bg-dark">
					<td>
						<select
							form="formNewScreen"
							class="form-select"
							bind:value={newScreenName}
							{...newScreenForm.fields.service.as('select')}
						>
							<option value="" selected disabled>---</option>
							{#each services as service (service.name)}
								<option value={service.name}>{service.name} [{service.type.name}]</option>
							{/each}
						</select>
					</td>
					<td>
						<select
							form="formNewScreen"
							class="form-select"
							bind:value={newScreenAction}
							{...newScreenForm.fields.action.as('select')}
						>
							<option value="">---</option>
							{#each screenActions as action (action)}
								<option value={action}>{action}</option>
							{/each}
						</select>
					</td>
					<td>
						<form id="formNewScreen" {...newScreenForm}>
							<input {...newScreenForm.fields.srv.as('hidden', name)} />

							<button
								type="submit"
								class="btn btn-theme"
								disabled={!newScreenName || !newScreenAction}
								title="Add"
							>
								<i class="fa-solid fa-plus"></i>
							</button>
						</form>
					</td>
				</tr>

				{#each screens as screen, index (index)}
					<tr>
						<td>
							{screen.name}
						</td>
						<td>
							{screen.action ?? '---'}
						</td>
						<td>
							<div class="btn-group">
								<button
									class="btn me-2"
									class:btn-primary={index > 0}
									class:btn-secondary={index === 0}
									disabled={index === 0}
									title="Move up"
									onclick={() => moveScreen({ srv: name, index, dir: 'up' })}
								>
									<i class="fa-solid fa-caret-up"></i>
								</button>

								<button
									class="btn me-2"
									class:btn-primary={index < screens.length - 1}
									class:btn-secondary={index === screens.length - 1}
									disabled={index === screens.length - 1}
									title="Move down"
									onclick={() => moveScreen({ srv: name, index, dir: 'down' })}
								>
									<i class="fa-solid fa-caret-down"></i>
								</button>

								<button
									class="btn btn-danger"
									title="Delete"
									onclick={() => deleteScreen({ srv: name, index })}
								>
									<i class="fa-solid fa-trash"></i>
								</button>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<div class="tab-pane container-fluid fade" id="icons">
		<table class="table">
			<colgroup>
				<col width="45%" />
				<col width="45%" />
				<col />
			</colgroup>

			<tbody>
				<tr class="bg-dark">
					<td>
						<select form="formNewIcon" name="service" class="form-select" bind:value={newIconName}>
							<option value="" selected disabled>---</option>
							{#each services as service (service.name)}
								<option value={service.name}>{service.name} [{service.type.name}]</option>
							{/each}
						</select>
					</td>
					<td>
						<select form="formNewIcon" name="action" class="form-select" bind:value={newIconAction}>
							<option value="">---</option>
							{#each iconActions as action (action)}
								<option value={action}>{action}</option>
							{/each}
						</select>
					</td>
					<td>
						<form id="formNewIcon" method="POST" use:enhance>
							<input type="hidden" name="action" value="add_icon" />
							<button
								type="submit"
								class="btn btn-theme"
								disabled={!newIconName || !newIconAction}
								title="Add"
							>
								<i class="fa-solid fa-plus"></i>
							</button>
						</form>
					</td>
				</tr>

				{#each icons as icon, index (index)}
					<tr>
						<td>
							{icon.name}
						</td>
						<td>
							{icon.action ?? '---'}
						</td>
						<td>
							<div class="btn-group">
								<form method="POST" use:enhance>
									<input type="hidden" name="action" value="move_icon" />
									<input type="hidden" name="dir" value="up" />
									<input type="hidden" name="index" value={index} />
									<button
										class="btn me-2"
										class:btn-primary={index > 0}
										class:btn-secondary={index === 0}
										disabled={index === 0}
										title="Move up"
									>
										<i class="fa-solid fa-caret-up"></i>
									</button>
								</form>
								<form method="POST" use:enhance>
									<input type="hidden" name="action" value="move_icon" />
									<input type="hidden" name="dir" value="down" />
									<input type="hidden" name="index" value={index} />
									<button
										class="btn me-2"
										class:btn-primary={index < icons.length - 1}
										class:btn-secondary={index === icons.length - 1}
										disabled={index === icons.length - 1}
										title="Move down"
									>
										<i class="fa-solid fa-caret-down"></i>
									</button>
								</form>
								<form method="POST" use:enhance>
									<input type="hidden" name="action" value="delete_icon" />
									<input type="hidden" name="index" value={index} />
									<button class="btn btn-danger" title="Delete">
										<i class="fa-solid fa-trash"></i>
									</button>
								</form>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<div class="tab-pane container-fluid fade" id="holidays">
		<form id="formHolidays" style="display: contents;" {...holidaysForm}>
			<input {...holidaysForm.fields.srv.as('hidden', name)} />

			<div class="row mb-2">
				<label for="inputCountry" class="col-form-label col-4">Country</label>
				<div class="col">
					<div class="input-group">
						<input
							id="inputCountry"
							class="form-control"
							class:is-invalid={!!holidaysForm.fields.country.issues()}
							class:is-valid={!holidaysForm.fields.country.issues()}
							{...holidaysForm.fields.country.as('text', data?.config.country ?? '')}
						/>
						{#each holidaysForm.fields.country.issues() as issue, i (i)}
							<div class="invalid-tooltip">{issue.message}</div>
						{/each}
					</div>
				</div>
			</div>

			<div class="row mb-2">
				<label for="inputState" class="col-form-label col-4">State</label>
				<div class="col">
					<div class="input-group">
						<input
							id="inputState"
							class="form-control"
							class:is-invalid={!!holidaysForm.fields.state.issues()}
							class:is-valid={!holidaysForm.fields.state.issues()}
							{...holidaysForm.fields.state.as('text', data?.config.state ?? '')}
						/>
						{#each holidaysForm.fields.state.issues() as issue, i (i)}
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
						disabled={holidaysForm.pending > 0 || !!holidaysForm.fields.allIssues()?.length}
					>
						Save
					</button>
				</div>
			</div>
		</form>
	</div>
</div>

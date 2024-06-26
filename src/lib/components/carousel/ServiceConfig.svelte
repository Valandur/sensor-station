<script lang="ts">
	import { applyAction, enhance } from '$app/forms';

	import type { CarouselServiceConfigData } from '$lib/models/carousel';

	import PerfectScrollbar from '../PerfectScrollbar.svelte';

	export let name: string;
	export let data: CarouselServiceConfigData;

	$: services = data.services;
	$: screens = data.config.screens;
	$: icons = data.config.icons;

	let newScreenName = '';
	let newScreenAction = '';
	let newIconName = '';
	let newIconAction = '';

	$: screenActions = services.find((s) => s.name === newScreenName)?.type.actions ?? [];
	$: if (!screenActions.includes(newScreenAction)) {
		newScreenAction = '';
	}

	$: iconActions = services.find((s) => s.name === newIconName)?.type.actions ?? [];
	$: if (!iconActions.includes(newIconAction)) {
		newIconAction = '';
	}
</script>

<ul class="nav nav-tabs">
	<li class="nav-item me-1">
		<a href="#screens" class="nav-link active" data-bs-toggle="tab">Screens</a>
	</li>
	<li class="nav-item me-1">
		<a href="#icons" class="nav-link" data-bs-toggle="tab">Icons</a>
	</li>
	<li class="nav-item me-1">
		<a href="#other" class="nav-link" data-bs-toggle="tab">Other</a>
	</li>
</ul>

<PerfectScrollbar class="tab-content flex-1 pt-3">
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
							name="service"
							class="form-select"
							bind:value={newScreenName}
						>
							<option value="" selected disabled>---</option>
							{#each services as service}
								<option value={service.name}>{service.name} [{service.type.name}]</option>
							{/each}
						</select>
					</td>
					<td>
						<select
							form="formNewScreen"
							name="action"
							class="form-select"
							bind:value={newScreenAction}
						>
							<option value="">---</option>
							{#each screenActions as action}
								<option value={action}>{action}</option>
							{/each}
						</select>
					</td>
					<td>
						<form id="formNewScreen" method="POST" use:enhance>
							<input type="hidden" name="name" value={name} />
							<input type="hidden" name="__formAction" value="add_screen" />
							<button
								type="submit"
								class="btn btn-theme"
								disabled={!newScreenName || !newScreenAction}
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
							<form method="POST" use:enhance>
								<input type="hidden" name="name" value={name} />
								<input type="hidden" name="__formAction" value="delete_screen" />
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
							{#each services as service}
								<option value={service.name}>{service.name} [{service.type.name}]</option>
							{/each}
						</select>
					</td>
					<td>
						<select form="formNewIcon" name="action" class="form-select" bind:value={newIconAction}>
							<option value="">---</option>
							{#each iconActions as action}
								<option value={action}>{action}</option>
							{/each}
						</select>
					</td>
					<td>
						<form id="formNewIcon" method="POST" use:enhance>
							<input type="hidden" name="name" value={name} />
							<input type="hidden" name="__formAction" value="add_icon" />
							<button type="submit" class="btn btn-theme" disabled={!newIconName || !newIconAction}>
								<i class="icofont-ui-add" />
							</button>
						</form>
					</td>
				</tr>

				{#each icons as icon, index}
					<tr>
						<td>
							{icon.name}
						</td>
						<td>
							{icon.action ?? '---'}
						</td>
						<td>
							<form method="POST" use:enhance>
								<input type="hidden" name="name" value={name} />
								<input type="hidden" name="__formAction" value="delete_icon" />
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

	<div class="tab-pane container-fluid fade" id="other">
		<form
			id="formOther"
			method="POST"
			style="display: contents;"
			use:enhance={() =>
				({ result }) =>
					applyAction(result)}
		>
			<input type="hidden" name="name" value={name} />
			<input type="hidden" name="__formAction" value="other" />

			<div class="row mb-2">
				<label for="inputCountry" class="col-3 col-form-label">Country</label>
				<div class="col">
					<input
						id="inputCountry"
						type="text"
						name="country"
						value={data.config.country}
						class="form-control"
					/>
				</div>
			</div>

			<div class="row mb-2">
				<label for="inputState" class="col-3 col-form-label">State</label>
				<div class="col">
					<input
						id="inputState"
						type="text"
						name="state"
						value={data.config.state}
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
</PerfectScrollbar>

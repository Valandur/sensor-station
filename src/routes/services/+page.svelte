<script lang="ts">
	import { enhance } from '$app/forms';
	import Card from '$lib/components/Card.svelte';

	import PageLayout from '$lib/components/PageLayout.svelte';
	import { SERVICES } from '$lib/services';

	import type { PageData } from './$types';

	export let data: PageData;
	$: types = data.types;
	$: services = data.services;

	let mainName = data.main?.name ?? '';
	let mainAction = data.main?.action ?? '';
	$: mainActions = services.find((s) => s.name === mainName)?.type.actions ?? [];

	let newName = '';
	let newType = '';
</script>

<PageLayout title="Services">
	<div class="row overflow-auto">
		<div class="col-full">
			<Card class="mb-2">
				<svelte:fragment slot="header">General settings</svelte:fragment>

				<form method="POST" action="?/save" class="row" use:enhance>
					<label for="selectMainService" class="col-auto col-form-label">Main</label>
					<div class="col">
						<select
							id="selectMainService"
							name="mainService"
							class="form-select"
							bind:value={mainName}
						>
							<option value="">--- None ---</option>
							{#each data.services as srv}
								<option value={srv.name}>{srv.name} [{srv.type.name}]</option>
							{/each}
						</select>
					</div>

					<div class="col">
						<select name="mainAction" class="form-select" bind:value={mainAction}>
							<option value="" selected disabled>---</option>
							{#each mainActions as action}
								<option value={action}>{action}</option>
							{/each}
						</select>
					</div>

					<div class="col-auto">
						<button type="submit" class="btn btn-theme">Save</button>
					</div>
				</form>
			</Card>
		</div>

		<div class="col">
			<table class="table">
				<colgroup>
					<col width="50%" />
					<col width="50%" />
					<col />
				</colgroup>

				<tbody>
					<tr class="bg-dark">
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
								{#each types as { name }}
									<option value={name}>{name}</option>
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

					{#each services as service}
						<tr>
							<td>
								{service.name}
							</td>
							<td>
								{service.type.name}
							</td>
							<td>
								<form method="POST" action="?/delete" use:enhance>
									<input type="hidden" name="name" value={service.name} />
									<div class="btn-group">
										{#if !!SERVICES[service.type.name]}
											{#if service.type.actions.includes('preview')}
												<a href="/services/{service.name}/preview" class="btn btn-primary">
													<i class="icofont-eye-alt"></i>
												</a>
											{/if}
											{#if service.type.actions.includes('config')}
												<a href="/services/{service.name}/config" class="btn btn-theme">
													<i class="icofont-gear"></i>
												</a>
											{/if}
										{/if}
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

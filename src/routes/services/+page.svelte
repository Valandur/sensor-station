<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';

	import PageLayout from '$lib/components/page-layout.svelte';
	import { SERVICES } from '$lib/services';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let types = $derived(data.types);
	let services = $derived(data.services);

	let mainName = $derived(data.main?.name ?? '');
	let mainAction = $derived(data.main?.action ?? '');
	let mainActions = $derived(services.find((s) => s.name === mainName)?.type.actions ?? []);

	let newName = $state('');
	let newType = $state('');
</script>

<PageLayout title="Services">
	<ul class="nav nav-tabs">
		<li class="nav-item me-1">
			<a href="#services" class="nav-link active" data-bs-toggle="tab">Services</a>
		</li>
		<li class="nav-item me-1">
			<a href="#general" class="nav-link" data-bs-toggle="tab">General</a>
		</li>
	</ul>

	<div class="tab-content flex-1 pt-3">
		<div class="tab-pane container-fluid fade show active" id="services">
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
								{#each types as { name } (name)}
									<option value={name}>{name}</option>
								{/each}
							</select>
						</td>
						<td>
							<form id="formNew" method="POST" action="?/add" use:enhance>
								<button
									type="submit"
									class="btn-theme btn"
									disabled={!newName || !newType}
									title="Add"
								>
									<i class="fa-solid fa-plus"></i>
								</button>
							</form>
						</td>
					</tr>

					{#each services as service (service.name)}
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
											{@const actions = service.type.actions.filter((a) => a !== 'config')}
											{#if actions.length > 1}
												<div class="dropdown">
													<button
														class="btn btn-primary"
														type="button"
														data-bs-toggle="dropdown"
														aria-expanded="false"
														title="View"
													>
														<i class="fa-solid fa-eye"></i>
													</button>
													<ul class="dropdown-menu">
														{#each actions as action (action)}
															<li>
																<a
																	class="dropdown-item"
																	href={resolve(`/services/${service.name}/${action}`)}
																>
																	{action}
																</a>
															</li>
														{/each}
													</ul>
												</div>
											{:else if actions.length > 0}
												<a
													href={resolve(`/services/${service.name}/${actions[0]}`)}
													class="btn btn-primary"
													title="View"
												>
													<i class="fa-solid fa-eye"></i>
												</a>
											{/if}
											{#if service.type.actions.includes('config')}
												<a
													href={resolve(`/services/${service.name}/config`)}
													class="btn-theme btn"
													title="Settings"
												>
													<i class="fa-solid fa-gear"></i>
												</a>
											{/if}
										{/if}
										<button class="btn btn-danger" title="Delete">
											<i class="fa-solid fa-trash"></i>
										</button>
									</div>
								</form>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<div class="tab-pane container-fluid fade" id="general">
			<form method="POST" action="?/save" class="row" use:enhance>
				<label for="selectMainService" class="col-form-label col-auto">Main</label>
				<div class="col">
					<select
						id="selectMainService"
						name="mainService"
						class="form-select"
						bind:value={mainName}
					>
						<option value="">--- None ---</option>
						{#each data.services as srv (srv.name)}
							<option value={srv.name}>{srv.name} [{srv.type.name}]</option>
						{/each}
					</select>
				</div>

				<div class="col">
					<select name="mainAction" class="form-select" bind:value={mainAction}>
						<option value="" selected disabled>---</option>
						{#each mainActions as action (action)}
							<option value={action}>{action}</option>
						{/each}
					</select>
				</div>

				<div class="col-auto">
					<button type="submit" class="btn-theme btn">Save</button>
				</div>
			</form>
		</div>
	</div>
</PageLayout>

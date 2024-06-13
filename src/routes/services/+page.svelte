<script lang="ts">
	import { enhance } from '$app/forms';

	import PageLayout from '$lib/components/PageLayout.svelte';
	import { SERVICES } from '$lib/services';

	import type { PageData } from './$types';

	export let data: PageData;
	$: types = data.types;
	$: services = data.services;

	let newName = '';
	let newType = '';
</script>

<PageLayout title="Services">
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

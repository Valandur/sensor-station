<script lang="ts">
	import { getContextClient, mutationStore, queryStore } from '@urql/svelte';

	import {
		GET_SCREENS,
		SAVE_SCREENS,
		screenNames,
		screenParams,
		type GetScreensData,
		type Screen
	} from '$lib/models/screen';

	let newName = '';
	let newParams = '';

	$: client = getContextClient();
	$: store = queryStore<GetScreensData>({
		query: GET_SCREENS,
		context: { additionalTypenames: ['Screen'] },
		client
	});
	$: screens = $store.data?.screens || [];

	$: save = (newScreens: Screen[]) =>
		mutationStore({
			query: SAVE_SCREENS,
			variables: {
				screens: newScreens.map((screen) => ({
					name: screen.name,
					params: Object.keys(screenParams[screen.name] || {}).includes(screen.params)
						? screen.params
						: ''
				}))
			},
			context: { additionalTypenames: ['Screen'] },
			client
		});

	$: add = () => save([...screens, { name: newName, params: newParams }]);
	$: del = (index: number) => save(screens.filter((screen, i) => i !== index));
	$: moveUp = (index: number) =>
		save([
			...screens.slice(0, index - 1),
			screens[index],
			screens[index - 1],
			...screens.slice(index + 1)
		]);
	$: moveDown = (index: number) =>
		save([
			...screens.slice(0, index),
			screens[index + 1],
			screens[index],
			...screens.slice(index + 2)
		]);
</script>

<div class="container-fluid m-0 p-1 vh-100 d-flex flex-column">
	<div class="row">
		<div class="col">
			<h1>Settings</h1>
		</div>
		<div class="col-auto">
			<a class="btn btn-sm btn-outline-theme" href="/"><i class="icofont-ui-close" /></a>
		</div>
	</div>

	<div class="row overflow-auto">
		<table class="table table-sm">
			<colgroup>
				<col width="50%" />
				<col width="50%" />
				<col />
				<col />
				<col />
			</colgroup>

			<tbody>
				{#each screens as screen, i}
					<tr>
						<td>{screenNames[screen.name] || screen.name}</td>
						<td>{screenParams[screen.name]?.[screen.params] || screen.params}</td>
						<td>
							<button
								class="btn btn-sm"
								class:btn-outline-theme={i > 0}
								class:btn-outline-secondary={i === 0}
								disabled={i === 0}
								on:click={() => moveUp(i)}
							>
								<i class="icofont-caret-up" />
							</button>
						</td>
						<td>
							<button
								class="btn btn-sm"
								class:btn-outline-theme={i < screens.length - 1}
								class:btn-outline-secondary={i === screens.length - 1}
								disabled={i === screens.length - 1}
								on:click={() => moveDown(i)}
							>
								<i class="icofont-caret-down" />
							</button>
						</td>
						<td>
							<button class="btn btn-sm btn-outline-danger" on:click={() => del(i)}>
								<i class="icofont-ui-delete" />
							</button>
						</td>
					</tr>
				{/each}

				<tr>
					<td>
						<select class="form-control form-control-sm" bind:value={newName}>
							{#each Object.entries(screenNames) as [value, name]}
								<option {value}>{name}</option>
							{/each}
						</select>
					</td>

					<td>
						{#if newName in screenParams}
							<select class="form-control form-control-sm" bind:value={newParams}>
								{#each Object.entries(screenParams[newName]) as [value, name]}
									<option {value}>{name}</option>
								{/each}
							</select>
						{/if}
					</td>

					<td />
					<td />

					<td>
						<button class="btn btn-sm btn-outline-success" on:click={add}>
							<i class="icofont-ui-add" />
						</button>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</div>

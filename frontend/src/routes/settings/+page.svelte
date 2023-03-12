<script lang="ts">
	import { getContextClient, mutationStore, queryStore } from '@urql/svelte';

	import { GET_SCREENS, SAVE_SCREENS, type GetScreensData } from '$lib/models/screen';

	let newName = '';
	let newParams = '';

	$: client = getContextClient();
	$: store = queryStore<GetScreensData>({
		query: GET_SCREENS,
		context: { additionalTypenames: ['Screen'] },
		client
	});
	$: screens = $store.data?.screens || [];

	$: add = () => {
		mutationStore({
			query: SAVE_SCREENS,
			variables: {
				screens: [{ name: newName, params: newParams }].concat(
					screens.map((screen) => ({ id: screen.id, name: screen.name, params: screen.params }))
				)
			},
			context: { additionalTypenames: ['Screen'] },
			client
		});
	};
	$: del = (id: number) => {
		mutationStore({
			query: SAVE_SCREENS,
			variables: {
				screens: screens
					.filter((screen) => screen.id !== id)
					.map((screen) => ({ id: screen.id, name: screen.name, params: screen.params }))
			},
			context: { additionalTypenames: ['Screen'] },
			client
		});
	};
</script>

<div class="container-fluid m-0 p-1 vh-100 d-flex flex-column">
	<div class="row">
		<div class="col">
			<h1>Settings</h1>
		</div>
		<div class="col-auto">
			<a class="btn btn-sm btn-outline-secondary" href="/"><i class="icofont-ui-close" /></a>
		</div>
	</div>

	<div class="row overflow-scroll">
		<table class="table table-sm">
			<colgroup>
				<col width="50%" />
				<col width="50%" />
				<col />
			</colgroup>
			<thead>
				<tr>
					<th scope="col">Screen</th>
					<th scope="col">Type</th>
					<th scope="col" />
				</tr>
			</thead>
			<tbody>
				{#each screens as screen}
					<tr>
						<td>{screen.name}</td>
						<td>{screen.params}</td>
						<td>
							<button class="btn btn-sm btn-outline-danger" on:click={() => del(screen.id)}>
								<i class="icofont-ui-delete" />
							</button>
						</td>
					</tr>
				{/each}

				<tr>
					<td>
						<select class="form-control form-control-sm" bind:value={newName}>
							<option value="weather">Weather</option>
							<option value="news">News</option>
							<option value="uploads">Uploads</option>
							<option value="calendar">Calendar</option>
						</select>
					</td>

					<td>
						{#if newName === 'news'}
							<select class="form-control form-control-sm" bind:value={newParams}>
								<option value="1646">Allgemein</option>
								<option value="718">Sport</option>
								<option value="454">Kultur</option>
								<option value="630">Wissen</option>
							</select>
						{:else if newName === 'weather'}
							<select class="form-control form-control-sm" bind:value={newParams}>
								<option value="daily">Täglich</option>
								<option value="hourly">Stündlich</option>
							</select>
						{:else}
							<input class="form-control form-control-sm" bind:value={newParams} />
						{/if}
					</td>

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

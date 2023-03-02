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

<div class="container">
	<h1>Settings</h1>

	<a class="btn close" href="/"><i class="icofont-ui-close" /></a>

	<div class="settings">
		<div class="setting">
			<div class="name">Screens</div>
			<div class="value list">
				{#each screens as screen}
					<div class="item">
						<div>{screen.name}</div>
						<div>{screen.params}</div>
						<button class="btn" on:click={() => del(screen.id)}
							><i class="icofont-ui-delete" /></button
						>
					</div>
				{/each}
				<div class="item">
					<input class="input" type="text" bind:value={newName} />
					<input class="input" type="text" bind:value={newParams} />
					<button class="btn" on:click={add}><i class="icofont-ui-add" /></button>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.container {
		height: 100vh;
		width: 100vw;
		padding: 0.3rem;
		box-sizing: border-box;
	}

	.container > .close {
		position: fixed;
		top: 10px;
		right: 10px;
		text-decoration: none;
	}

	.container > h1 {
		font-size: 1.5rem;
		line-height: 1.5rem;
		margin-top: 0;
		margin-bottom: 1rem;
	}

	.settings {
		display: flex;
		flex-direction: column;
	}

	.setting {
		display: flex;
		flex-direction: row;
		border-bottom: 1px dashed orange;
	}

	.name {
		flex: 1;
		font-size: 1rem;
	}

	.value {
		flex: 3;
		font-size: 1rem;
	}

	.list {
		display: flex;
		flex-direction: column;
	}

	.list > .item {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-bottom: 0.5rem;
	}

	.list > .item > div,
	.list > .item > input {
		flex: 1;
		margin-right: 1rem;
	}

	.list > .item > button {
		width: 1.5rem;
	}
</style>

<script lang="ts">
	import { getContextClient, gql, mutationStore, queryStore } from '@urql/svelte';

	import { BASE_URL } from '$lib/client';
	import { DELETE_UPLOAD, SAVE_UPLOAD, UPLOAD_ITEMS, type UploadItems } from '$lib/models/upload';
	import { format, parseISO } from 'date-fns';

	const QUERY = gql`
		query Uploads {
			...UploadItems
		}
		${UPLOAD_ITEMS}
	`;

	let fileInput: HTMLInputElement;
	let newImg: string | null = null;
	let newTitle = '';
	let newDate = format(new Date(), 'yyyy-MM-dd');

	function onChangeFile(e: Event & { currentTarget: HTMLInputElement }) {
		const image = e.currentTarget.files![0];

		const reader = new FileReader();
		reader.readAsDataURL(image);
		reader.onload = (evt) => {
			newImg = evt.target?.result as string;
		};
	}

	$: client = getContextClient();
	$: store = queryStore<UploadItems>({
		query: QUERY,
		context: { additionalTypenames: ['UploadItem'] },
		client
	});
	$: items = $store.data?.uploads.items?.reverse() || [];

	function del(img: string) {
		mutationStore({
			query: DELETE_UPLOAD,
			variables: { img },
			context: { additionalTypenames: ['Screen'] },
			client
		});
	}
	function save(img: string, ts: string, title: string) {
		mutationStore({
			query: SAVE_UPLOAD,
			variables: { img, ts, title },
			context: { additionalTypenames: ['Screen'] },
			client
		});
	}
	function clear() {
		newImg = null;
		fileInput.value = '';
	}
</script>

<div class="container-fluid m-0 p-1 vh-100 d-flex flex-column">
	<div class="row">
		<div class="col">
			<h1>Uploads</h1>
		</div>
	</div>

	<div class="row overflow-auto">
		<table class="table table-sm">
			<colgroup>
				<col width="10%" />
				<col width="15%" />
				<col width="75%" />
				<col />
			</colgroup>

			<tbody>
				<tr>
					<td>
						{#if !newImg}
							<button class="btn btn-sm" on:click={() => fileInput.click()}>
								<i class="icofont-image icofont-2x" />
							</button>
						{:else}
							<button class="btn btn-sm m-0 p-0" on:click={clear}>
								<img src={newImg} alt="Uploaded file" />
							</button>
						{/if}
						<input
							type="file"
							style:display="none"
							accept=".jpg, .jpeg, .png .mp4"
							on:change={onChangeFile}
							bind:this={fileInput}
						/>
					</td>
					<td>
						<input type="date" class="form-control form-control-sm" bind:value={newDate} />
					</td>
					<td>
						<input type="text" class="form-control form-control-sm" bind:value={newTitle} />
					</td>
					<td>
						<button
							class="btn btn-sm"
							class:btn-outline-success={newImg && newDate && newTitle}
							class:btn-outline-secondary={!newImg || !newDate || !newTitle}
							disabled={!newImg || !newDate || !newTitle}
							on:click={() => newImg && save(newImg, newDate, newTitle)}
						>
							<i class="icofont-ui-add" />
						</button>
					</td>
				</tr>

				{#each items as item}
					<tr>
						<td class="m-0 p-1">
							{#if item.img.endsWith('.mp4')}
								<video src={BASE_URL + '/data/server/uploads/' + item.img} muted />
							{:else}
								<img src={BASE_URL + '/data/server/uploads/' + item.img} alt="Upload" />
							{/if}
						</td>
						<td class="m-0 p-1">
							<input
								type="date"
								class="form-control form-control-sm"
								on:change={(e) => (item.ts = e.currentTarget.value)}
								value={format(parseISO(item.ts), 'yyyy-MM-dd')}
							/>
						</td>
						<td class="m-0 p-1">
							<input
								type="text"
								class="form-control form-control-sm"
								on:change={(e) => (item.title = e.currentTarget.value)}
								value={item.title}
							/>
						</td>
						<td>
							<div class="btn-group">
								<button
									class="btn btn-sm btn-outline-success"
									on:click={() => save(item.img, item.ts, item.title)}
								>
									<i class="icofont-save" />
								</button>
								<button class="btn btn-sm btn-outline-danger" on:click={() => del(item.img)}>
									<i class="icofont-ui-delete" />
								</button>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<style lang="scss">
	img,
	video {
		max-width: 100px;
		max-height: 100px;
	}

	input {
		color-scheme: dark;
	}
</style>

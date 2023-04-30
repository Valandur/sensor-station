<script lang="ts">
	import { format, parseISO } from 'date-fns';
	import de from 'date-fns/locale/de/index';

	import type { PageData } from './$types';

	export let data: PageData;
	$: uploads = data.uploads;

	let fileInput: HTMLInputElement;
	let newImg: string | null = null;
	let newTitle = '';
	let newDate = new Date();

	function onChangeFile(e: Event & { currentTarget: HTMLInputElement }) {
		const image = e.currentTarget.files![0];

		const reader = new FileReader();
		reader.readAsDataURL(image);
		reader.onload = (evt) => {
			newImg = evt.target?.result as string;
		};
	}

	function del(img: string) {
		// TODO
	}
	function save(img: string, ts: Date, title: string) {
		// TODO
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

				{#each uploads as upload}
					<tr>
						<td class="m-0 p-1">
							{#if upload.img.endsWith('.mp4')}
								<video src={'/data/uploads/' + upload.img} muted />
							{:else}
								<img src={'/data/uploads/' + upload.img} alt="Upload" />
							{/if}
						</td>
						<td class="m-0 p-1">
							<input
								type="date"
								class="form-control form-control-sm"
								on:change={(e) => (upload.ts = parseISO(e.currentTarget.value))}
								value={format(upload.ts, 'yyyy-MM-dd', { locale: de })}
							/>
						</td>
						<td class="m-0 p-1">
							<input
								type="text"
								class="form-control form-control-sm"
								on:change={(e) => (upload.title = e.currentTarget.value)}
								value={upload.title}
							/>
						</td>
						<td>
							<div class="btn-group">
								<button
									class="btn btn-sm btn-outline-success"
									on:click={() => save(upload.img, upload.ts, upload.title)}
								>
									<i class="icofont-save" />
								</button>
								<button class="btn btn-sm btn-outline-danger" on:click={() => del(upload.img)}>
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

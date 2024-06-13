<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { format } from 'date-fns/format';
	import { de } from 'date-fns/locale/de';
	import { parseISO } from 'date-fns/parseISO';

	import type { GalleryServiceConfigData } from '$lib/models/gallery';

	export let name: string;
	export let data: GalleryServiceConfigData;

	$: images = data.images;

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

	function clear() {
		newImg = null;
		fileInput.value = '';
	}
</script>

<div class="row overflow-auto">
	<table class="col table table-sm">
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
						name="newImage"
						form="formNew"
						accept=".jpg, .jpeg, .png .mp4"
						style:display="none"
						on:change={onChangeFile}
						bind:this={fileInput}
					/>
				</td>
				<td>
					<input
						type="date"
						form="formNew"
						name="newDate"
						class="form-control form-control-sm"
						bind:value={newDate}
					/>
				</td>
				<td>
					<input
						type="text"
						form="formNew"
						name="newTitle"
						class="form-control form-control-sm"
						bind:value={newTitle}
					/>
				</td>
				<td>
					<form id="formNew" method="POST" enctype="multipart/form-data" use:enhance>
						<input type="hidden" name="name" value={name} />
						<input type="hidden" name="action" value="add" />
						<button
							class="btn btn-sm"
							class:btn-outline-success={newImg && newDate && newTitle}
							class:btn-outline-secondary={!newImg || !newDate || !newTitle}
							disabled={!newImg || !newDate || !newTitle}
						>
							<i class="icofont-ui-add" />
						</button>
					</form>
				</td>
			</tr>

			{#each images as upload, i}
				<tr>
					<td class="m-0 p-1">
						{#if upload.img.endsWith('.mp4')}
							<video src={'/' + upload.img} muted />
						{:else}
							<img src={'/' + upload.img} alt="Upload" />
						{/if}
					</td>
					<td class="m-0 p-1">
						<input
							type="date"
							form={`formSave${i}`}
							name="date"
							class="form-control form-control-sm"
							on:change={(e) => (upload.ts = parseISO(e.currentTarget.value))}
							value={format(upload.ts, 'yyyy-MM-dd', { locale: de })}
						/>
					</td>
					<td class="m-0 p-1">
						<input
							type="text"
							form={`formSave${i}`}
							name="title"
							class="form-control form-control-sm"
							on:change={(e) => (upload.title = e.currentTarget.value)}
							value={upload.title}
						/>
					</td>
					<td>
						<div class="btn-group">
							<form
								id={`formSave${i}`}
								method="POST"
								use:enhance={() =>
									({ result }) =>
										applyAction(result)}
							>
								<input type="hidden" name="name" value={name} />
								<input type="hidden" name="action" value="save" />
								<input type="hidden" name="index" value={i} />
								<button class="btn btn-sm btn-outline-success">
									<i class="icofont-save" />
								</button>
							</form>
							<form method="POST" use:enhance>
								<input type="hidden" name="name" value={name} />
								<input type="hidden" name="action" value="move" />
								<input type="hidden" name="dir" value="up" />
								<input type="hidden" name="index" value={i} />
								<button
									class="btn btn-sm"
									class:btn-outline-theme={i > 0}
									class:btn-outline-secondary={i === 0}
									disabled={i === 0}
								>
									<i class="icofont-caret-up" />
								</button>
							</form>
							<form method="POST" use:enhance>
								<input type="hidden" name="name" value={name} />
								<input type="hidden" name="action" value="move" />
								<input type="hidden" name="dir" value="down" />
								<input type="hidden" name="index" value={i} />
								<button
									class="btn btn-sm"
									class:btn-outline-theme={i < images.length - 1}
									class:btn-outline-secondary={i === images.length - 1}
									disabled={i === images.length - 1}
								>
									<i class="icofont-caret-down" />
								</button>
							</form>
							<form method="POST" use:enhance>
								<input type="hidden" name="name" value={name} />
								<input type="hidden" name="action" value="delete" />
								<input type="hidden" name="index" value={i} />
								<button class="btn btn-sm btn-outline-danger">
									<i class="icofont-ui-delete" />
								</button>
							</form>
						</div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
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

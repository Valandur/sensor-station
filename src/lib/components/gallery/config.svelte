<script lang="ts">
	import {
		addImageForm,
		getConfig,
		moveImage,
		removeImage,
		saveImageForm
	} from '$lib/gallery.remote';

	import Loader from '../loader.svelte';
	import ErrorCard from '../error-card.svelte';
	import { format } from 'date-fns';

	let { name }: { name: string } = $props();

	let fileInput: HTMLInputElement;
	let newImg = $state<string | null>(null);
	let newTitle = $state('');
	let newDate = $state(new Date());

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

<svelte:boundary>
	{@const config = await getConfig(name)}

	<div class="row overflow-auto">
		<table class="col table table-sm">
			<colgroup>
				<col width="10%" />
				<col width="25%" />
				<col width="65%" />
				<col />
			</colgroup>

			<tbody>
				<tr>
					<td>
						{#if !newImg}
							<button class="btn btn-sm w-100" onclick={() => fileInput.click()} title="Pick image">
								<i class="fa-solid fa-image fa-xl"></i>
							</button>
						{:else}
							<button class="btn btn-sm m-0 p-0" onclick={clear}>
								<img src={newImg} alt="Uploaded file" />
							</button>
						{/if}
						<input
							form="formNew"
							accept=".jpg, .jpeg, .png .mp4"
							style:display="none"
							onchange={onChangeFile}
							bind:this={fileInput}
							{...addImageForm.fields.image.as('file')}
						/>
					</td>
					<td>
						<input
							form="formNew"
							class="form-control form-control-sm"
							{...addImageForm.fields.date.as('date')}
						/>
					</td>
					<td>
						<input
							form="formNew"
							class="form-control form-control-sm"
							bind:value={newTitle}
							{...addImageForm.fields.title.as('text')}
						/>
					</td>
					<td>
						<form id="formNew" {...addImageForm} enctype="multipart/form-data">
							<input {...addImageForm.fields.srv.as('hidden', name)} />
							<button
								class="btn btn-sm"
								class:btn-outline-success={newImg && newDate && newTitle}
								class:btn-outline-secondary={!newImg || !newDate || !newTitle}
								disabled={!newImg || !newDate || !newTitle}
								title="Add image"
							>
								<i class="fa-solid fa-plus"></i>
							</button>
						</form>
					</td>
				</tr>

				{#each config.images as galleryImage, i (i)}
					{@const form = saveImageForm.for(i)}

					<tr>
						<td class="m-0 p-1">
							{#if galleryImage.img.endsWith('.mp4')}
								<video src={'/' + galleryImage.img} muted></video>
							{:else}
								<img src={'/' + galleryImage.img} alt="Upload" />
							{/if}
						</td>
						<td class="m-0 p-1">
							<div class="input-group">
								<input
									form={`formSave${i}`}
									class="form-control form-control-sm"
									class:is-invalid={!!form.fields.date.issues()}
									class:is-valid={!form.fields.date.issues()}
									{...form.fields.date.as('date', format(galleryImage.date, 'yyyy-MM-dd'))}
								/>
								{#each form.fields.title.issues() as issue, i (i)}
									<div class="invalid-tooltip">{issue.message}</div>
								{/each}
							</div>
						</td>
						<td class="m-0 p-1">
							<div class="input-group">
								<input
									form={`formSave${i}`}
									class="form-control form-control-sm"
									class:is-invalid={!!form.fields.title.issues()}
									class:is-valid={!form.fields.title.issues()}
									{...form.fields.title.as('text', galleryImage.title)}
								/>
								{#each form.fields.title.issues() as issue, i (i)}
									<div class="invalid-tooltip">{issue.message}</div>
								{/each}
							</div>
						</td>
						<td>
							<div class="btn-group">
								<form
									id={`formSave${i}`}
									{...form.enhance(({ submit }) => submit())}
									onchange={() => form.validate()}
								>
									<input {...addImageForm.fields.srv.as('hidden', name)} />
									<input {...form.fields.index.as('hidden', `${i}`)} />
									<button class="btn btn-sm btn-outline-success" title="Save">
										<i class="fa-solid fa-floppy-disk"></i>
									</button>
								</form>

								<button
									class="btn btn-sm"
									class:btn-outline-theme={i > 0}
									class:btn-outline-secondary={i === 0}
									disabled={i === 0}
									title="Move up"
									onclick={() => moveImage({ srv: name, index: i, dir: 'up' })}
								>
									<i class="fa-solid fa-caret-up"></i>
								</button>

								<button
									class="btn btn-sm"
									class:btn-outline-theme={i < config.images.length - 1}
									class:btn-outline-secondary={i === config.images.length - 1}
									disabled={i === config.images.length - 1}
									title="Move down"
									onclick={() => moveImage({ srv: name, index: i, dir: 'up' })}
								>
									<i class="fa-solid fa-caret-down"></i>
								</button>

								<button
									class="btn btn-sm btn-outline-danger"
									title="Remove"
									onclick={() => removeImage({ srv: name, index: i })}
								>
									<i class="fa-solid fa-trash"></i>
								</button>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	{#snippet pending()}
		<Loader />
	{/snippet}

	{#snippet failed(error)}
		{console.log(error)}
		<ErrorCard message="Error loading config" params={{ error }} />
	{/snippet}
</svelte:boundary>

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

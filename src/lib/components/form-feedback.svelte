<script lang="ts">
	import ErrorCard from './error-card.svelte';

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let { form, showSuccess = true }: { form: Record<string, any> | null; showSuccess?: boolean } =
		$props();
</script>

{#if form}
	{#if form.success}
		<div class="alert alert-success alert-dismissable fade show p-2">
			<div class="row">
				<div class="col">Success!</div>

				<div class="d-flex flex-column col-auto">
					<button type="button" class="btn-close" data-bs-dismiss="alert" title="Close"></button>
				</div>
			</div>
		</div>
	{:else if showSuccess && form.message}
		<ErrorCard message={form.message} />
	{/if}
{/if}

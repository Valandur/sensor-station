<script lang="ts">
	import ErrorCard from './ErrorCard.svelte';

	export let form: Record<string, any> | null;
	export let showSuccess: boolean = true;
</script>

{#if form}
	{#if form.success}
		<div class="alert alert-success alert-dismissable fade show p-2">
			<div class="row">
				<div class="col">Success!</div>

				<div class="col-auto d-flex flex-column">
					<button type="button" class="btn-close" data-bs-dismiss="alert"></button>
				</div>
			</div>
		</div>
	{:else if showSuccess && form.message}
		<ErrorCard message={form.message} />
	{/if}
{/if}

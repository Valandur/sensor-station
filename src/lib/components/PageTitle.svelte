<script lang="ts">
	export let showReload: boolean = false;
	export let closeUrl: string = '/';

	function reload() {
		window.location.reload();
	}
</script>

<div class="row z-1">
	<div class="col-auto">
		<h1><slot /></h1>
	</div>
	<div class="col align-self-center text-secondary">
		<slot name="center" />
	</div>
	<div class="col-auto">
		{#if showReload}
			<button class="btn btn-sm btn-theme" on:click={reload}>
				<i class="icofont-refresh" />
			</button>
		{/if}
		<a class="btn btn-sm btn-danger" href={closeUrl}>
			<i class="icofont-ui-close" />
		</a>
	</div>
</div>

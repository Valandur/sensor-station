<script lang="ts">
	export let simple: boolean;
	export let head: string;
	export let body: string;
</script>

<svelte:head>
	{#if !simple}
		<base href="https://www.srf.ch/" />
		{@html head}
	{/if}
</svelte:head>

<div class="main overflow-scroll">
	{@html body}
</div>

<style lang="scss">
	:global(html),
	:global(body) {
		margin: 0;
		padding: 0;
		font-size: 32px;
	}

	.main {
		padding: 0.5em;
	}
</style>

<script lang="ts">
	export let connected: boolean;
</script>

{#if connected}
	<i class="fa-solid fa-link"></i>
{:else}
	<i class="fa-solid fa-link-slash"></i>
{/if}

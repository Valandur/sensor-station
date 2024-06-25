<script lang="ts">
	export let connected: boolean;
</script>

{#if connected}
	<i class="icofont-link"></i>
{:else}
	<i class="icofont-link-broken"></i>
{/if}

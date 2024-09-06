<script lang="ts">
	import type { NetworkServiceMainData } from '$lib/models/network';

	export let data: NetworkServiceMainData;
	$: connected = data.connected;
</script>

{#if connected}
	<i class="fa-solid fa-link"></i>
{:else}
	<i class="fa-solid fa-link-slash"></i>
{/if}

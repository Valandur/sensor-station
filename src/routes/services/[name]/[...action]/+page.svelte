<script lang="ts">
	import { SERVICES } from '$lib/services';

	import type { PageData } from './$types';

	export let data: PageData;
	$: comps = SERVICES[data.type];
</script>

<svelte:component this={comps.action} name={data.name} action={data.action} />

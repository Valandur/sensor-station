<script lang="ts">
	import { WIDGETS } from '$lib/widgets';

	import type { PageData } from './$types';

	export let data: PageData;
	$: comps = WIDGETS[data.type];
</script>

<svelte:component this={comps.action} name={data.name} action={data.action} />

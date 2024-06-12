<script lang="ts">
	import { WIDGETS } from '$lib/widgets';

	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	$: name = data.name;
	$: type = data.type;
	$: widgetData = data.data;

	$: comp = WIDGETS[type];
</script>

<svelte:component this={comp} {name} data={widgetData} {form} />

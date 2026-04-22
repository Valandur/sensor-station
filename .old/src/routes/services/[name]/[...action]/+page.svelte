<script lang="ts">
	import { SERVICES } from '$lib/services';

	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	$: name = data.name;
	$: type = data.type;
	$: action = data.action;
	$: serviceData = data.data;

	$: comp = SERVICES[type];
</script>

<svelte:component this={comp} {name} {action} data={serviceData} {form} />

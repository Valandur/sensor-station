<script lang="ts">
	import { SERVICES } from '$lib/services';

	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let name = $derived(data.name);
	let type = $derived(data.type);
	let action = $derived(data.action);

	let Comp = $derived(SERVICES[type]);
</script>

<Comp {name} {action} isEmbedded={false} />

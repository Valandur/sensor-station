<script lang="ts">
	import type { NetworkServiceData } from '$lib/models/network';

	import ErrorCard from '../ErrorCard.svelte';
	import PageLayout from '../PageLayout.svelte';
	import Interfaces from './Interfaces.svelte';

	export let name: string;
	export let data: NetworkServiceData | null;
</script>

<PageLayout title="Network" subTitle={name} closeUrl="/services">
	{#if data}
		{#if data.type === 'data'}
			<Interfaces interfaces={data.interfaces} />
		{:else}
			<ErrorCard title="Gallery" message="Unknown action" params={{ name, data }} />
		{/if}
	{:else}
		<ErrorCard title="Gallery" message="Missing data" params={{ name }} />
	{/if}
</PageLayout>

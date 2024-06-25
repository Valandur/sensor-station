<script lang="ts">
	import type { NetworkServiceAction, NetworkServiceData } from '$lib/models/network';

	import ErrorCard from '../ErrorCard.svelte';
	import PageLayout from '../PageLayout.svelte';
	import Icon from './Icon.svelte';
	import Interfaces from './Interfaces.svelte';

	export let name: string;
	export let action: NetworkServiceAction;
	export let data: NetworkServiceData | null;
	export let isEmbedded: boolean = false;
</script>

<PageLayout title="Network" subTitle={name} closeUrl="/services" show={!isEmbedded}>
	{#if data}
		{#if data.type === 'data'}
			{#if action === 'icon'}
				<Icon connected={data.connected} />
			{:else}
				<Interfaces interfaces={data.interfaces} />
			{/if}
		{:else}
			<ErrorCard title="Gallery" message="Unknown action" params={{ name, data }} />
		{/if}
	{:else}
		<ErrorCard title="Gallery" message="Missing data" params={{ name }} />
	{/if}
</PageLayout>

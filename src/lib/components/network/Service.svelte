<script lang="ts">
	import type { NetworkServiceAction, NetworkServiceData } from '$lib/models/network';

	import ErrorCard from '../ErrorCard.svelte';
	import PageLayout from '../PageLayout.svelte';
	import Icon from './Icon.svelte';
	import Interfaces from './Interfaces.svelte';
	import ServiceConfig from './ServiceConfig.svelte';

	export let name: string;
	export let action: NetworkServiceAction;
	export let data: NetworkServiceData | null;
	export let form: Record<string, any> | null;
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
		{:else if data.type === 'config'}
			{#if form?.message}
				<ErrorCard message={form.message} />
			{:else if form?.success}
				<div class="alert alert-success m-0">Config saved!</div>
			{/if}
			<ServiceConfig {name} {form} {data} />
		{:else}
			<ErrorCard title="Network" message="Unknown action" params={{ name, data }} />
		{/if}
	{:else}
		<ErrorCard title="Network" message="Missing data" params={{ name }} />
	{/if}
</PageLayout>

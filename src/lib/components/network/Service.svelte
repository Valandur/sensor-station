<script lang="ts">
	import type { NetworkServiceAction, NetworkServiceData } from '$lib/models/network';

	import ErrorCard from '../ErrorCard.svelte';
	import PageLayout from '../PageLayout.svelte';
	import FormFeedback from '../FormFeedback.svelte';
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
				<Icon {data} />
			{:else}
				<Interfaces {data} />
			{/if}
		{:else if data.type === 'config'}
			<FormFeedback {form} />
			<ServiceConfig {form} {data} />
		{:else}
			<ErrorCard title="Network" message="Unknown action" params={{ name, data }} />
		{/if}
	{:else}
		<ErrorCard title="Network" message="Missing data" params={{ name }} />
	{/if}
</PageLayout>

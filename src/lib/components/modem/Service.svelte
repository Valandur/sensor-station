<script lang="ts">
	import type { ModemServiceAction, ModemServiceData } from '$lib/models/modem';

	import ErrorCard from '../ErrorCard.svelte';
	import PageLayout from '../PageLayout.svelte';
	import FormFeedback from '../FormFeedback.svelte';
	import ServiceConfig from './ServiceConfig.svelte';
	import Modem from './Modem.svelte';
	import Icon from './Icon.svelte';
	import Debug from './Debug.svelte';

	export let name: string;
	export let action: ModemServiceAction;
	export let data: ModemServiceData | null;
	export let form: Record<string, any> | null;
	export let isEmbedded: boolean = false;
</script>

<PageLayout title="Modem" subTitle={name} closeUrl="/services" show={!isEmbedded}>
	{#if data}
		{#if data.type === 'data'}
			{#if action === 'icon'}
				<Icon {data} />
			{:else}
				<Modem {data} />
			{/if}
		{:else if data.type === 'config'}
			<FormFeedback {form} />
			<ServiceConfig {data} />
		{:else if data.type === 'debug'}
			<Debug {data} />
		{:else}
			<ErrorCard title="Modem" message="Unknown action" params={{ name, data }} />
		{/if}
	{:else}
		<ErrorCard title="Modem" message="Missing data" params={{ name }} />
	{/if}
</PageLayout>

<script lang="ts">
	import type { BatteryServiceAction, BatteryServiceData } from '$lib/models/battery';

	import ErrorCard from '../ErrorCard.svelte';
	import PageLayout from '../PageLayout.svelte';
	import FormFeedback from '../FormFeedback.svelte';
	import ServiceConfig from './ServiceConfig.svelte';
	import Battery from './Battery.svelte';
	import Icon from './Icon.svelte';

	export let name: string;
	export let action: BatteryServiceAction;
	export let data: BatteryServiceData | null;
	export let form: Record<string, any> | null;
	export let isEmbedded: boolean = false;
</script>

<PageLayout title="Battery" subTitle={name} closeUrl="/services" show={!isEmbedded}>
	{#if data}
		{#if data.type === 'data'}
			{#if action === 'icon'}
				<Icon battery={data.info} />
			{:else}
				<Battery info={data.info} />
			{/if}
		{:else if data.type === 'config'}
			<FormFeedback {form} />
			<ServiceConfig {name} {data} />
		{:else}
			<ErrorCard title="Battery" message="Unknown action" params={{ name, data }} />
		{/if}
	{:else}
		<ErrorCard title="Battery" message="Missing data" params={{ name }} />
	{/if}
</PageLayout>

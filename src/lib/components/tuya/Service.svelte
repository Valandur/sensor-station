<script lang="ts">
	import type { TuyaServiceData } from '$lib/models/tuya';

	import ErrorCard from '../ErrorCard.svelte';
	import PageLayout from '../PageLayout.svelte';
	import FormFeedback from '../FormFeedback.svelte';
	import ServiceConfig from './ServiceConfig.svelte';
	import Info from './Info.svelte';

	export let name: string;
	export let data: TuyaServiceData | null;
	export let form: Record<string, any> | null;
	export let isEmbedded: boolean = false;
</script>

<PageLayout title="Tuya" subTitle={name} closeUrl="/services" show={!isEmbedded}>
	{#if data}
		{#if data.type === 'data'}
			<Info {data} />
		{:else if data.type === 'config'}
			<FormFeedback {form} />
			<ServiceConfig {data} />
		{:else}
			<ErrorCard title="Tuya" message="Unknown action" params={{ name, data }} />
		{/if}
	{:else}
		<ErrorCard title="Tuya" message="Missing data" params={{ name }} />
	{/if}
</PageLayout>

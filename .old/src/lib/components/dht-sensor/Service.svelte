<script lang="ts">
	import type { DhtSensorServiceData } from '$lib/models/dht-sensor';

	import ErrorCard from '../ErrorCard.svelte';
	import PageLayout from '../PageLayout.svelte';
	import FormFeedback from '../FormFeedback.svelte';
	import ServiceConfig from './ServiceConfig.svelte';
	import Measurement from './Measurement.svelte';

	export let name: string;
	export let data: DhtSensorServiceData | null;
	export let form: Record<string, any> | null;
	export let isEmbedded: boolean = false;
</script>

<PageLayout title="DHT sensor" subTitle={name} closeUrl="/services" show={!isEmbedded}>
	{#if data}
		{#if data.type === 'data'}
			<Measurement {data} />
		{:else if data.type === 'config'}
			<FormFeedback {form} />
			<ServiceConfig {data} />
		{:else}
			<ErrorCard title="DHT sensor" message="Unknown action" params={{ name, data }} />
		{/if}
	{:else}
		<ErrorCard title="DHT sensor" message="Missing data" params={{ name }} />
	{/if}
</PageLayout>

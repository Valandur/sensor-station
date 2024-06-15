<script lang="ts">
	import type { DhtSensorServiceData } from '$lib/models/dht-sensor';

	import ErrorCard from '../ErrorCard.svelte';
	import PageLayout from '../PageLayout.svelte';
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
			<Measurement measurement={data.measurement} />
		{:else if data.type === 'config'}
			{#if form?.message}
				<ErrorCard message={form.message} />
			{:else if form?.success}
				<div class="alert alert-success m-0">Config saved!</div>
			{/if}
			<ServiceConfig {name} {data} />
		{:else}
			<ErrorCard title="DHT sensor" message="Unknown action" params={{ name, data }} />
		{/if}
	{:else}
		<ErrorCard title="DHT sensor" message="Missing data" params={{ name }} />
	{/if}
</PageLayout>

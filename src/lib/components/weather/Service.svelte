<script lang="ts">
	import type {
		WeatherServiceAction,
		WeatherServiceData,
		WeatherServiceInstance
	} from '$lib/models/weather';

	import ErrorCard from '../ErrorCard.svelte';
	import PageLayout from '../PageLayout.svelte';
	import ServiceConfig from './ServiceConfig.svelte';
	import ServiceMain from './ServiceMain.svelte';

	export let instance: WeatherServiceInstance;
	export let action: WeatherServiceAction;
	export let data: WeatherServiceData | null;
	export let form: Record<string, any> | null;
</script>

<PageLayout title="Weather" subTitle={instance.name} closeUrl="/services">
	{#if !action}
		{#if data}
			<ServiceMain {data} />
		{:else}
			<ErrorCard title="Weather" message="Missing data" params={{ instance, action, data }} />
		{/if}
	{:else if action === 'config'}
		{#if form}
			{#if form.success}
				<div class="alert alert-success m-0">Config saved!</div>
			{:else}
				<ErrorCard message={form.message} />
			{/if}
		{/if}
		<ServiceConfig {instance} />
	{:else}
		<ErrorCard title="Weather" message="Unknown action" params={{ instance, action, data }} />
	{/if}
</PageLayout>

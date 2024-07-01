<script lang="ts">
	import type { WeatherServiceData } from '$lib/models/weather';

	import ErrorCard from '../ErrorCard.svelte';
	import PageLayout from '../PageLayout.svelte';
	import Pagination from '../Pagination.svelte';
	import FormFeedback from '../FormFeedback.svelte';
	import ServiceConfig from './ServiceConfig.svelte';
	import Daily from './Daily.svelte';
	import Hourly from './Hourly.svelte';
	import Alerts from './Alerts.svelte';

	export let name: string;
	export let data: WeatherServiceData | null;
	export let form: Record<string, any> | null;
	export let isEmbedded: boolean = false;
</script>

<PageLayout title="Weather" subTitle={name} closeUrl="/services" show={!isEmbedded}>
	{#if data}
		{#if data.type === 'hourly'}
			<Hourly location={data.location} hourly={data.hourly} />
		{:else if data.type === 'daily'}
			<Daily location={data.location} daily={data.daily} />
		{:else if data.type === 'alerts'}
			<Pagination prevPage={data.prevPage} nextPage={data.nextPage}>
				<Alerts location={data.location} alert={data.alert} />
			</Pagination>
		{:else if data.type === 'config'}
			<FormFeedback {form} />
			<ServiceConfig {name} {data} />
		{:else}
			<ErrorCard title="Weather" message="Unknown action" params={{ name, data }} />
		{/if}
	{:else}
		<ErrorCard title="Weather" message="Missing data" params={{ name }} />
	{/if}
</PageLayout>

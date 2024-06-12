<script lang="ts">
	import type { SrfServiceData } from '$lib/models/srf';

	import ErrorCard from '../ErrorCard.svelte';
	import PageLayout from '../PageLayout.svelte';
	import ServiceConfig from './ServiceConfig.svelte';
	import News from './News.svelte';

	export let name: string;
	export let data: SrfServiceData | null;
	export let form: Record<string, any> | null;
</script>

<PageLayout title="SRF" subTitle={name} closeUrl="/services">
	{#if data}
		{#if !data.action}
			<News {name} items={data.items} />
		{:else if data.action === 'config'}
			{#if form?.message}
				<ErrorCard message={form.message} />
			{:else if form?.success}
				<div class="alert alert-success m-0">Config saved!</div>
			{/if}
			<ServiceConfig {name} {data} />
		{:else}
			<ErrorCard title="SRF" message="Unknown action" params={{ name, data }} />
		{/if}
	{:else}
		<ErrorCard title="SRF" message="Missing data" params={{ name }} />
	{/if}
</PageLayout>

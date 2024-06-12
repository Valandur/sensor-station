<script lang="ts">
	import type { SrfWidgetData } from '$lib/models/srf';

	import ErrorCard from '../ErrorCard.svelte';
	import PageLayout from '../PageLayout.svelte';
	import WidgetConfig from './WidgetConfig.svelte';
	import News from './News.svelte';
	import Details from './Details.svelte';

	export let name: string;
	export let data: SrfWidgetData | null;
	export let form: Record<string, any> | null;
	export let isEmbedded: boolean;
</script>

<PageLayout
	title="SRF"
	subTitle={name}
	closeUrl="/widgets"
	show={!isEmbedded && data?.action !== 'details'}
>
	{#if data}
		{#if !data.action}
			<News {name} items={data.items} />
		{:else if data.action === 'config'}
			{#if form?.message}
				<ErrorCard message={form.message} />
			{:else if form?.success}
				<div class="alert alert-success m-0">Config saved!</div>
			{/if}
			<WidgetConfig {name} {data} />
		{:else if data.action === 'details'}
			<Details head={data.head} body={data.body} simple={data.simple} />
		{:else}
			<ErrorCard title="SRF" message="Unknown action" params={{ name, data }} />
		{/if}
	{:else}
		<ErrorCard title="SRF" message="Missing data" params={{ name }} />
	{/if}
</PageLayout>

<script lang="ts">
	import type { SrfServiceData } from '$lib/models/srf';

	import ErrorCard from '../ErrorCard.svelte';
	import PageLayout from '../PageLayout.svelte';
	import Pagination from '../Pagination.svelte';
	import FormFeedback from '../FormFeedback.svelte';
	import ServiceConfig from './ServiceConfig.svelte';
	import News from './News.svelte';
	import Details from './Details.svelte';

	export let name: string;
	export let data: SrfServiceData | null;
	export let form: Record<string, any> | null;
	export let isEmbedded: boolean = false;
</script>

<PageLayout
	title="SRF"
	subTitle={name}
	closeUrl="/services"
	show={!isEmbedded && data?.type !== 'details'}
>
	{#if data}
		{#if data.type === 'data'}
			<Pagination prevPage={data.prevPage} nextPage={data.nextPage}>
				<News {name} articles={data.articles} />
			</Pagination>
		{:else if data.type === 'details'}
			<Details head={data.head} body={data.body} simple={data.simple} />
		{:else if data.type === 'config'}
			<FormFeedback {form} />
			<ServiceConfig {name} {data} />
		{:else}
			<ErrorCard title="SRF" message="Unknown action" params={{ name, data }} />
		{/if}
	{:else}
		<ErrorCard title="SRF" message="Missing data" params={{ name }} />
	{/if}
</PageLayout>

<script lang="ts">
	import type { ModemServiceData } from '$lib/models/modem';

	import ErrorCard from '../ErrorCard.svelte';
	import PageLayout from '../PageLayout.svelte';
	import ServiceConfig from './ServiceConfig.svelte';
	import Preview from './Preview.svelte';

	export let name: string;
	export let data: ModemServiceData | null;
	export let form: Record<string, any> | null;
	export let isEmbedded: boolean = false;
</script>

<PageLayout title="Battery" subTitle={name} closeUrl="/services" show={!isEmbedded}>
	{#if data}
		{#if data.type === 'data'}
			<Preview info={data.info} />
		{:else if data.type === 'config'}
			{#if form?.message}
				<ErrorCard message={form.message} />
			{:else if form?.success}
				<div class="alert alert-success m-0">Config saved!</div>
			{/if}
			<ServiceConfig {name} {data} />
		{:else}
			<ErrorCard title="Battery" message="Unknown action" params={{ name, data }} />
		{/if}
	{:else}
		<ErrorCard title="Battery" message="Missing data" params={{ name }} />
	{/if}
</PageLayout>

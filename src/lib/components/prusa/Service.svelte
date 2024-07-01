<script lang="ts">
	import type { PrusaServiceData } from '$lib/models/prusa';

	import ErrorCard from '../ErrorCard.svelte';
	import PageLayout from '../PageLayout.svelte';
	import FormFeedback from '../FormFeedback.svelte';
	import ServiceConfig from './ServiceConfig.svelte';
	import Printer from './Printer.svelte';

	export let name: string;
	export let data: PrusaServiceData | null;
	export let form: Record<string, any> | null;
	export let isEmbedded: boolean = false;
</script>

<PageLayout title="Prusa" subTitle={name} closeUrl="/services" show={!isEmbedded}>
	{#if data}
		{#if data.type === 'data'}
			<Printer job={data.job} printer={data.printer} />
		{:else if data.type === 'config'}
			<FormFeedback {form} />
			<ServiceConfig {name} {data} />
		{:else}
			<ErrorCard title="Prusa" message="Unknown action" params={{ name, data }} />
		{/if}
	{:else}
		<ErrorCard title="Prusa" message="Missing data" params={{ name }} />
	{/if}
</PageLayout>

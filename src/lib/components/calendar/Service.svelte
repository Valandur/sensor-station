<script lang="ts">
	import type { CalendarServiceData } from '$lib/models/calendar';

	import ErrorCard from '../ErrorCard.svelte';
	import PageLayout from '../PageLayout.svelte';
	import Pagination from '../Pagination.svelte';
	import FormFeedback from '../FormFeedback.svelte';
	import ServiceConfig from './ServiceConfig.svelte';
	import Events from './Events.svelte';

	export let name: string;
	export let data: CalendarServiceData | null;
	export let form: Record<string, any> | null;
	export let isEmbedded: boolean = false;
</script>

<PageLayout title="Calendar" subTitle={name} closeUrl="/services" show={!isEmbedded}>
	{#if data}
		{#if data.type === 'data'}
			<Pagination prevPage={data.prevPage} nextPage={data.nextPage}>
				<Events events={data.events} />
			</Pagination>
		{:else if data.type === 'config'}
			<FormFeedback {form} />
			<ServiceConfig {name} {data} />
		{:else}
			<ErrorCard title="Calendar" message="Unknown action" params={{ name, data }} />
		{/if}
	{:else}
		<ErrorCard title="Calendar" message="Missing data" params={{ name }} />
	{/if}
</PageLayout>

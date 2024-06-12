<script lang="ts">
	import type {
		NetworkServiceAction,
		NetworkServiceData,
		NetworkServiceInstance
	} from '$lib/models/network';

	import ErrorCard from '../ErrorCard.svelte';
	import PageLayout from '../PageLayout.svelte';
	import ServiceMain from './ServiceMain.svelte';

	export let instance: NetworkServiceInstance;
	export let action: NetworkServiceAction;
	export let data: NetworkServiceData | null;
	export let form: Record<string, any> | null;
</script>

<PageLayout title="Network" subTitle={instance.name} closeUrl="/services">
	{#if !action}
		{#if data}
			<ServiceMain {data} />
		{:else}
			<ErrorCard title="Network" message="Missing data" />
		{/if}
	{:else}
		<ErrorCard title="Calendar" message="Unknown action" params={{ instance, action, data }} />
	{/if}
</PageLayout>

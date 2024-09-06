<script lang="ts">
	import PageTitle from './PageTitle.svelte';
	import PerfectScrollbar from './PerfectScrollbar.svelte';

	export let title: string;
	export let subTitle: string = '';
	export let closeUrl: string = '/';
	export let show: boolean = true;
</script>

{#if show}
	<PageTitle showReload {closeUrl}>
		<svelte:fragment>{title}</svelte:fragment>
		<svelte:fragment slot="center">{subTitle}</svelte:fragment>
	</PageTitle>

	<PerfectScrollbar class="row">
		<div class="col">
			<slot />
		</div>
	</PerfectScrollbar>
{:else}
	<slot />
{/if}

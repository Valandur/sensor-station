<script lang="ts">
	import PageTitle from './PageTitle.svelte';

	export let title: string;
	export let subTitle: string = '';
</script>

<div class="container-fluid vh-100 d-flex flex-column py-1">
	<PageTitle showReload>
		<svelte:fragment>{title}</svelte:fragment>
		<svelte:fragment slot="center">{subTitle}</svelte:fragment>
	</PageTitle>

	<slot />
</div>

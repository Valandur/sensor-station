<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';

	let {
		type = 'theme',
		header,
		body,
		title,
		subTitle,
		children,
		footer,
		class: clazz
	}: {
		type: 'theme' | 'primary' | 'warning';
		header?: Snippet;
		body?: Snippet;
		title?: Snippet;
		subTitle?: Snippet;
		children?: Snippet;
		footer?: Snippet;
		class?: ClassValue;
	} = $props();
</script>

<div class="card bg-{type} border-{type} bg-opacity-25 {clazz}">
	{#if header}
		<div class="card-header border-{type} fw-bold small d-flex justify-content-between">
			{@render header()}
		</div>
	{/if}

	{#if body}
		{@render body()}
	{:else if title || subTitle || children}
		<div class="card-body">
			{#if title}
				<h5 class="card-title">
					{@render title()}
				</h5>
			{/if}

			{#if subTitle}
				<h6 class="card-subtitle text-opacity-50 mb-2 text-white">
					{@render subTitle()}
				</h6>
			{/if}

			{@render children?.()}
		</div>
	{/if}

	{#if footer}
		<div class="card-footer">
			{@render footer()}
		</div>
	{/if}

	<div class="card-arrow">
		<div class="card-arrow-top-left"></div>
		<div class="card-arrow-top-right"></div>
		<div class="card-arrow-bottom-left"></div>
		<div class="card-arrow-bottom-right"></div>
	</div>
</div>

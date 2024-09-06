<script lang="ts">
	export let type: 'theme' | 'primary' | 'warning' = 'theme';
</script>

<div class="card bg-{type} border-{type} bg-opacity-25 {$$props.class}">
	{#if $$slots.header}
		<div class="card-header border-{type} fw-bold small d-flex justify-content-between">
			<slot name="header" />
		</div>
	{/if}

	{#if $$slots.body}
		<slot name="body" />
	{:else if $$slots.title || $$slots.subTitle || $$slots.default}
		<div class="card-body">
			{#if $$slots.title}
				<h5 class="card-title">
					<slot name="title" />
				</h5>
			{/if}

			{#if $$slots.subTitle}
				<h6 class="card-subtitle mb-2 text-white text-opacity-50">
					<slot name="subTitle" />
				</h6>
			{/if}

			{#if $$slots.default}
				<slot />
			{/if}
		</div>
	{/if}

	{#if $$slots.footer}
		<div class="card-footer">
			<slot name="footer" />
		</div>
	{/if}

	<div class="card-arrow">
		<div class="card-arrow-top-left" />
		<div class="card-arrow-top-right" />
		<div class="card-arrow-bottom-left" />
		<div class="card-arrow-bottom-right" />
	</div>
</div>

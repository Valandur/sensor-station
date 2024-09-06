<script lang="ts">
	import { dev } from '$app/environment';
	import { fade, slide } from 'svelte/transition';
	import { onMount } from 'svelte';
	import 'bootstrap-icons/font/bootstrap-icons.min.css';
	import '@fortawesome/fontawesome-free/css/all.min.css';
	import 'perfect-scrollbar/css/perfect-scrollbar.css';

	import { swipe, type SwipeEvent } from '$lib/swipe';
	import '$lib/theme/scss/styles.scss';
	import '$lib/theme/scss/font.scss';

	let showToolbar = false;

	function onSwipe(e: SwipeEvent) {
		if (e.detail.dir === 'down' && e.detail.y.start < 100) {
			showToolbar = true;
		} else if (e.detail.dir === 'up' && showToolbar) {
			showToolbar = false;
		}
	}

	function reload() {
		window.location.reload();
	}

	onMount(async () => {
		import('bootstrap');
		document.querySelector('body')?.classList.add('app-init');
	});
</script>

<svelte:body use:swipe={{ y: 100 }} on:swipe={onSwipe} />

<div id="content" class="app-content p-1 d-flex flex-column">
	<slot />
</div>

{#if dev}
	<div class="dev-note z-2">DEV</div>
{/if}

{#if showToolbar}
	<div
		class="overlay"
		role="presentation"
		transition:fade={{ duration: 500 }}
		on:click={() => (showToolbar = false)}
	/>
	<div class="toolbar row p-2 bg-black" transition:slide={{ duration: 500 }}>
		<a class="col-auto btn btn-theme p-3" href="/" on:click={() => (showToolbar = false)}>
			<i class="fa-solid fa-house fa-2xl"></i>
		</a>

		<div class="col" />

		<a
			class="col-auto btn btn-theme p-3 ms-2"
			href="/services"
			on:click={() => (showToolbar = false)}
		>
			<i class="fa-solid fa-gears fa-2xl"></i>
		</a>

		<button class="col-auto btn btn-warning p-3 ms-2" on:click={reload}>
			<i class="fa-solid fa-rotate fa-2xl"></i>
		</button>

		<form method="POST" action="/?/restart" class="col-auto p-0 ms-2">
			<button type="submit" class="btn btn-danger p-3">
				<i class="fa-solid fa-power-off fa-2xl"></i>
			</button>
		</form>
	</div>
{/if}

<style>
	:global(html),
	:global(body) {
		font-size: 32px;
	}

	.dev-note {
		position: fixed;
		top: 4px;
		left: 50%;
		padding: 2px 8px;
		font-weight: 600;
		color: var(--bs-black);
		background-color: rgba(var(--bs-warning-rgb), 0.6);
		border: 4px solid var(--bs-black);
	}

	.toolbar {
		position: fixed;
		top: 0;
		left: calc(0.5 * var(--bs-gutter-x));
		right: calc(0.5 * var(--bs-gutter-x));
		overflow: hidden;
		display: flex;
		flex-direction: row;
		z-index: 100;
	}

	.overlay {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background-color: rgba(var(--bs-white-rgb), 0.2);
		z-index: 10;
	}
</style>

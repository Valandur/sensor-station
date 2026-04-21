<script lang="ts">
	import { dev } from '$app/environment';
	import { fade, slide } from 'svelte/transition';
	import { onMount, type Snippet } from 'svelte';
	import { resolve } from '$app/paths';
	import 'bootstrap-icons/font/bootstrap-icons.min.css';
	import '@fortawesome/fontawesome-free/css/all.min.css';
	import 'perfect-scrollbar/css/perfect-scrollbar.css';

	import { swipe, type SwipeEvent } from '$lib/swipe';
	import favicon from '$lib/assets/favicon.svg';

	import '../scss/styles.scss';

	let { children }: { children?: Snippet } = $props();

	let showToolbar = $state(false);

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

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<svelte:body use:swipe={{ y: 100 }} onswipe={onSwipe} />

<div id="content" class="app-content d-flex flex-column p-1">
	{@render children?.()}
</div>

{#if dev}
	<div class="dev-note z-2">DEV</div>
{/if}

{#if showToolbar}
	<div
		class="overd"
		role="presentation"
		transition:fade={{ duration: 500 }}
		onclick={() => (showToolbar = false)}
	></div>

	<div class="toolbar row bg-black p-2" transition:slide={{ duration: 500 }}>
		<a
			class="btn-theme btn col-auto p-3"
			href={resolve('/')}
			onclick={() => (showToolbar = false)}
			title="Home"
		>
			<i class="fa-solid fa-house fa-2xl"></i>
		</a>

		<div class="col"></div>

		<a
			class="btn-theme btn col-auto ms-2 p-3"
			href={resolve('/services')}
			onclick={() => (showToolbar = false)}
			title="Settings"
		>
			<i class="fa-solid fa-gears fa-2xl"></i>
		</a>

		<button class="btn-warning btn col-auto ms-2 p-3" onclick={reload} title="Reload">
			<i class="fa-solid fa-rotate fa-2xl"></i>
		</button>

		<form method="POST" action="/?/restart" class="col-auto ms-2 p-0">
			<button type="submit" class="btn btn-danger p-3" title="Restart">
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
</style>

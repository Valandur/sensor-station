<script lang="ts">
	import { dev } from '$app/environment';
	import { fade, slide } from 'svelte/transition';
	import { onMount } from 'svelte';

	import { swipe, type SwipeEvent } from '$lib/swipe';

	import '$lib/theme/scss/styles.scss';
	import '$lib/theme/scss/font.scss';

	let showToolbar = false;

	onMount(() => document.body.classList.add('app-init'));

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
</script>

<svelte:body use:swipe={{ y: 100 }} on:swipe={onSwipe} />

<slot />

{#if dev}
	<div class="dev-note">DEV</div>
{/if}

{#if showToolbar}
	<div
		class="overlay"
		transition:fade={{ duration: 500 }}
		on:click={() => (showToolbar = false)}
		on:keypress={() => (showToolbar = false)}
	/>
	<div class="toolbar row p-2 bg-black" transition:slide={{ duration: 500 }}>
		<div class="col-auto">
			<a class="btn btn-theme" href="/screens" on:click={() => (showToolbar = false)}>
				<i class="icofont-home icofont-2x" />
			</a>
		</div>
		<div class="col-auto">
			<a class="btn btn-outline-theme" href="/modem" on:click={() => (showToolbar = false)}>
				<i class="icofont-globe icofont-2x" />
			</a>
		</div>
		<div class="col-auto">
			<a class="btn btn-outline-theme" href="/network" on:click={() => (showToolbar = false)}>
				<i class="icofont-network icofont-2x" />
			</a>
		</div>
		<div class="col-auto">
			<a class="btn btn-outline-theme" href="/battery" on:click={() => (showToolbar = false)}>
				<i class="icofont-battery-half icofont-2x" />
			</a>
		</div>

		<div class="col" />

		<div class="col-auto">
			<a class="btn btn-theme" href="/settings" on:click={() => (showToolbar = false)}>
				<i class="icofont-gears icofont-2x" />
			</a>
		</div>
		<div class="col-auto">
			<button class="btn btn-warning" on:click={reload}>
				<i class="icofont-refresh icofont-2x" />
			</button>
		</div>
		<div class="col-auto">
			<form method="POST" action="/?/restart">
				<button type="submit" class="btn btn-danger">
					<i class="icofont-power icofont-2x" />
				</button>
			</form>
		</div>
	</div>
{/if}

<style>
	:global(html),
	:global(body) {
		font-size: 30px;
	}

	.dev-note {
		position: fixed;
		top: 4px;
		left: 4px;
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

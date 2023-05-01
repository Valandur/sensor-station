<script lang="ts">
	import { browser } from '$app/environment';
	import { fade, slide } from 'svelte/transition';
	import { formatInTimeZone } from 'date-fns-tz';
	import { goto } from '$app/navigation';
	import { navigating } from '$app/stores';
	import { onDestroy } from 'svelte';
	import de from 'date-fns/locale/de/index';

	import { paused, progress, reset, start } from '$lib/stores/screen';
	import { swipe, type SwipeEvent } from '$lib/swipe';
	import { time } from '$lib/stores/time';

	import type { LayoutData } from './$types';

	const UPDATE_INTERVAL = 20000;
	const TIMEZONE = 'Europe/Zurich';

	export let data: LayoutData;

	let showToolbar = false;

	$: timeStr = formatInTimeZone($time, TIMEZONE, 'HH:mm', { locale: de });
	$: date = formatInTimeZone($time, TIMEZONE, 'd. MMMM', { locale: de });
	$: dateSub = formatInTimeZone($time, TIMEZONE, 'eeee', { locale: de }).replace('.', '');
	$: modemStatus = data.modem;
	$: batteryStatus = data.battery;
	$: holiday = data.holiday;

	$: if (browser) {
		reset();
		if (!$paused && data.nextScreen) {
			const next = data.nextScreen;
			start(() => goto(next), UPDATE_INTERVAL);
		}
	}

	onDestroy(() => {
		reset();
	});

	function togglePause() {
		paused.update((p) => !p);
	}

	function onSwipe(e: SwipeEvent) {
		if (e.detail.dir === 'left' && data.nextScreen && !showToolbar) {
			goto(data.nextScreen);
		} else if (e.detail.dir === 'right' && data.prevScreen && !showToolbar) {
			goto(data.prevScreen);
		} else if (e.detail.dir === 'down' && e.detail.y.start < 100) {
			showToolbar = true;
		} else if (e.detail.dir === 'up' && showToolbar) {
			showToolbar = false;
		}
	}

	function reload() {
		window.location.reload();
	}
</script>

<div
	class="container-fluid m-0 p-1 vh-100 d-flex flex-column"
	use:swipe={{ x: 200, y: 100 }}
	on:swipe={onSwipe}
>
	<div class="row mb-3">
		<div
			class="col-auto d-flex flex-column justify-content-end"
			on:click={togglePause}
			on:keypress={togglePause}
		>
			<h1 class="m-0 mt-2 p-0">{timeStr}</h1>
		</div>

		<div class="col text-end d-flex flex-column justify-content-end">
			<div class="row icons justify-content-end">
				{#if paused}
					<div class="col-auto">
						<i class="icofont-ui-pause" />
					</div>
				{/if}

				{#if modemStatus?.operator}
					<div class="col-auto">
						<i class="icofont-globe" />
						{modemStatus.operator}
					</div>
				{/if}

				{#if modemStatus?.signal}
					<div class="col-auto">
						<i class="icofont-signal" />
						{(modemStatus.signal / 4) * 100}%
					</div>
				{/if}

				{#if modemStatus?.lat && modemStatus?.lng}
					<div class="col-auto">
						<i class="icofont-satellite" />
						{modemStatus.lat.toFixed(2)} | {modemStatus.lng.toFixed(2)}
					</div>
				{/if}

				{#if batteryStatus?.state.includes('CHARGING')}
					<div class="col-auto">
						<i class="icofont-plugin" />
					</div>
				{/if}

				{#if batteryStatus}
					<div class="col-auto">
						{#if batteryStatus.charge > 70}
							<i class="icofont-battery-full" />
						{:else if batteryStatus.charge > 40}
							<i class="icofont-battery-half" />
						{:else if batteryStatus.charge > 10}
							<i class="icofont-battery-low" />
						{:else}
							<i class="icofont-battery-empty" />
						{/if}
						{batteryStatus.charge}%
					</div>
				{/if}
			</div>

			<div class="row justify-content-end">
				<h2 class="col m-0">{date}</h2>
			</div>

			<div class="row justify-content-end">
				{#if holiday}
					<div class="col-auto">{holiday.name}</div>
					<div class="col-auto">•</div>
				{/if}
				<h4 class="col-auto m-0">{dateSub}</h4>
			</div>
		</div>
	</div>

	<div class="row flex-fill position-relative">
		{#key data.index}
			<div
				class="container h-100 w-100 m-0 p-0 position-absolute"
				style:overflow="hidden"
				transition:fade
			>
				<slot />
			</div>
		{/key}
	</div>

	{#if showToolbar}
		<div class="overlay" transition:fade={{ duration: 500 }} />
		<div class="toolbar row p-2 bg-dark" transition:slide={{ duration: 500 }}>
			<div class="col-auto">
				<a class="btn btn-theme" href="/settings">
					<i class="icofont-gears icofont-2x" />
				</a>
			</div>
			<div class="col-auto">
				<a class="btn btn-theme" href="/modem">
					<i class="icofont-globe icofont-2x" />
				</a>
			</div>
			<div class="col-auto">
				<a class="btn btn-theme" href="/battery">
					<i class="icofont-battery-half icofont-2x" />
				</a>
			</div>
			<div class="col" />
			<div class="col-auto">
				<button class="btn btn-warning" on:click={reload}>
					<i class="icofont-refresh icofont-2x" />
				</button>
			</div>
			<div class="col-auto">
				<form method="POST" action="/screens?/restart">
					<button type="submit" class="btn btn-danger">
						<i class="icofont-power icofont-2x" />
					</button>
				</form>
			</div>
		</div>
	{/if}
</div>

<div class="progress bg-secondary" style:width={$progress + '%'} />

{#if $navigating}
	<div class="loading">
		<i class="icofont-spinner" />
	</div>
{/if}

<style lang="scss">
	h1 {
		font-size: 5rem;
		line-height: 4rem;
	}

	h2 {
		font-size: 2rem;
		line-height: 2rem;
	}

	.icons {
		font-size: 0.6rem;
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

	.progress {
		position: fixed;
		left: 0;
		bottom: 0;
		height: 2px;
	}

	.loading {
		position: fixed;
		bottom: 10px;
		right: 16px;
		z-index: 1000;
		animation: rotating 2s linear infinite;
	}

	@keyframes rotating {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>

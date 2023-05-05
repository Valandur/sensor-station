<script lang="ts">
	import { browser } from '$app/environment';
	import { fade, slide } from 'svelte/transition';
	import { formatInTimeZone } from 'date-fns-tz';
	import { beforeNavigate, goto, invalidate } from '$app/navigation';
	import { navigating } from '$app/stores';
	import { onDestroy } from 'svelte';
	import de from 'date-fns/locale/de/index';

	import { paused, progress, reset, start } from '$lib/stores/screen';
	import { swipe, type SwipeEvent } from '$lib/swipe';
	import { time } from '$lib/stores/time';

	import type { LayoutData } from './$types';

	const SWITCH_INTERVAL = 20000;
	const UPDATE_INTERVAL = 60000;

	export let data: LayoutData;
	$: index = data.index;
	$: timezone = data.modem?.tzName || data.modem?.tzOffset || 'Europe/Zurich';
	$: timeStr = formatInTimeZone($time, timezone, 'HH:mm', { locale: de });
	$: secondStr = formatInTimeZone($time, timezone, 'ss', { locale: de });
	$: date = formatInTimeZone($time, timezone, 'd. MMMM yyyy', { locale: de });
	$: dateSub = formatInTimeZone($time, timezone, 'eeee', { locale: de }).replace('.', '');
	$: modemStatus = data.modem;
	$: batteryStatus = data.battery;
	$: holiday = data.holiday;

	let showToolbar = false;
	let timer: ReturnType<typeof setInterval> | null = null;

	$: if (browser) {
		reset();
		if (timer) {
			clearInterval(timer);
			timer = null;
		}
		if (!$paused && data.nextScreen) {
			const next = data.nextScreen;
			start(() => goto(next), SWITCH_INTERVAL);
		} else if ($paused) {
			timer = setInterval(() => invalidate('screens:layout'), UPDATE_INTERVAL);
		}
	}

	beforeNavigate(() => reset(false));
	onDestroy(() => {
		if (timer) {
			clearInterval(timer);
			timer = null;
		}
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
	class="container-fluid m-0 p-0 vh-100 d-flex flex-column"
	use:swipe={{ x: 200, y: 100 }}
	on:swipe={onSwipe}
>
	<div class="row m-1 mb-2 flex-nowrap">
		<div
			class="col-auto d-flex flex-row align-items-end p-0"
			on:click={togglePause}
			on:keypress={togglePause}
		>
			<div class="time-main">{timeStr}</div>
			<div class="time-seconds ms-1">{secondStr}</div>
		</div>

		<div class="col d-flex flex-column justify-content-start align-items-end overflow-hidden p-0">
			<div class="row icons flex-nowrap">
				{#if modemStatus?.operator}
					<div class="col-auto">
						<i class="icofont-globe" />
						{modemStatus.operator.split(' ', 2)[0]}
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

				{#if $paused}
					<div class="col-auto">
						<i class="icofont-ui-pause" />
					</div>
				{/if}
			</div>

			<div class="row flex-nowrap">
				<div class="h2 col text-nowrap m-0">{date}</div>
			</div>

			<div class="row align-items-center flex-nowrap">
				{#if holiday}
					<div class="col-auto text-nowrap m-0">{holiday.name}</div>
					<div class="col-auto m-0">•</div>
				{/if}
				<div class="col-auto fw-bold text-white text-nowrap m-0">{dateSub}</div>
			</div>
		</div>
	</div>

	<div class="row flex-fill position-relative">
		{#key index}
			<div class="container h-100 w-100 m-0 p-1 position-absolute overflow-hidden" transition:fade>
				<slot />
			</div>
		{/key}
	</div>

	{#if showToolbar}
		<div
			class="overlay"
			transition:fade={{ duration: 500 }}
			on:click={() => (showToolbar = false)}
			on:keypress={() => (showToolbar = false)}
		/>
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
	:global(html),
	:global(body) {
		overflow: hidden;
		overscroll-behavior: none;
	}

	.time-main {
		font-size: 5rem;
		line-height: 4rem;
		font-weight: 600;
		color: var(--bs-white);
	}

	.time-seconds {
		font-size: 1.8rem;
		line-height: 1.6rem;
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

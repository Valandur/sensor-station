<script lang="ts">
	import { beforeNavigate, goto, invalidate } from '$app/navigation';
	import { browser } from '$app/environment';
	import { fade } from 'svelte/transition';
	import { formatInTimeZone } from 'date-fns-tz';
	import { navigating } from '$app/stores';
	import { onDestroy } from 'svelte';
	import { de } from 'date-fns/locale';

	import { paused, progress, reset, start } from '$lib/stores/screen';
	import { swipe, type SwipeEvent } from '$lib/swipe';
	import { time } from '$lib/stores/time';
	import { tz } from '$lib/stores/tz';
	import { WIDGETS } from '$lib/widgets';

	import type { PageData } from './$types';

	export let data: PageData;
	$: index = data.index;
	$: screen = data.screen;
	$: modem = data.modem;
	$: battery = data.battery;
	$: holiday = data.holiday;
	$: timeStr = formatInTimeZone($time, $tz, 'HH:mm', { locale: de });
	$: tzStr = formatInTimeZone($time, $tz, 'O', { locale: de });
	$: secondStr = formatInTimeZone($time, $tz, 'ss', { locale: de });
	$: date = formatInTimeZone($time, $tz, 'd. MMMM yyyy', { locale: de });
	$: dateSub = formatInTimeZone($time, $tz, 'eeee', { locale: de }).replace('.', '');

	let timer: ReturnType<typeof setInterval> | null = null;

	$: if (browser) {
		reset();
		if (timer) {
			clearInterval(timer);
			timer = null;
		}
		if (!$paused && data.nextScreen) {
			const next = data.nextScreen;
			start(() => goto(next), data.switchInterval);
		} else if ($paused) {
			timer = setInterval(() => invalidate('carousel'), data.updateInterval);
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
		console.log(e.detail.dir, data.nextPage);
		if (e.detail.dir === 'left' && data.nextScreen) {
			goto(data.nextScreen);
		} else if (e.detail.dir === 'right' && data.prevScreen) {
			goto(data.prevScreen);
		} else if (e.detail.dir === 'up' && data.nextPage) {
			goto(data.nextPage);
		} else if (e.detail.dir === 'down' && data.prevPage) {
			goto(data.prevPage);
		}
	}
</script>

<div
	class="container-fluid vh-100 d-flex flex-column"
	use:swipe={{ x: 200, y: 100 }}
	on:swipe={onSwipe}
>
	<div class="row flex-nowrap mb-2 p-1">
		<div
			role="presentation"
			class="col-auto d-flex flex-row align-items-end mt-1 p-0"
			on:click={togglePause}
		>
			<div class="time-main">{timeStr}</div>
			<div class="time-seconds align-self-stretch d-flex flex-column justify-content-between ms-2">
				<div>{secondStr}</div>
				<div class="text-muted text-nowrap">{tzStr}</div>
			</div>
		</div>

		<div class="col d-flex flex-column justify-content-end align-items-end p-0">
			<div class="row icons flex-nowrap justify-content-end">
				{#if modem?.cellular.operator}
					<div class="col-auto">
						<i class="icofont-globe" />
						{modem.cellular.operator.split(' ', 2)[0]}
					</div>
				{/if}

				{#if modem?.cellular.signal}
					<div class="col-auto">
						<i class="icofont-signal" />
						{modem.cellular.signal.toFixed(0)}%
					</div>
				{/if}

				{#if modem?.gps}
					<div class="col-auto">
						<i class="icofont-satellite"></i>
						{modem.gps.lat.toFixed(2)} | {modem.gps.lng.toFixed(2)}
					</div>
				{:else if modem?.geo}
					<div class="col-auto">
						<i class="icofont-world"></i>
						{modem.geo.lat.toFixed(2)} | {modem.geo.lng.toFixed(2)}
					</div>
				{/if}

				{#if battery}
					<div class="col-auto">
						{#if battery.charge > 70}
							<i class="icofont-battery-full" />
						{:else if battery.charge > 40}
							<i class="icofont-battery-half" />
						{:else if battery.charge > 10}
							<i class="icofont-battery-low" />
						{:else}
							<i class="icofont-battery-empty" />
						{/if}
						{battery.charge}%
					</div>
				{/if}

				{#if battery?.state.includes('CHARGING')}
					<div class="col-auto">
						<i class="icofont-plugin" />
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
			<div class="h-100 w-100 m-0 p-1 position-absolute overflow-hidden" transition:fade>
				{#if screen.widget}
					{@const comps = WIDGETS[screen.widget.type]}
					<svelte:component this={comps.main} {...data.props} />
				{:else}
					<p class="alert alert-info m-2">
						There are no screens setup! Check the
						<a class="alert-link" href="/settings">settings</a>
						to add some.
					</p>
				{/if}
			</div>
		{/key}
	</div>
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
		font-size: 5em;
		line-height: 0.8em;
		font-weight: 600;
		color: var(--bs-white);
	}

	.time-seconds {
		> :first-child {
			font-size: 2.2em;
			line-height: 0.9em;
		}

		> :last-child {
			font-size: 1.4em;
			line-height: 1.1em;
		}
	}

	.icons {
		font-size: 0.6em;
		height: 1.5em;
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

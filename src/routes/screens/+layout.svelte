<script lang="ts">
	import { beforeNavigate, goto, invalidate } from '$app/navigation';
	import { browser } from '$app/environment';
	import { fade } from 'svelte/transition';
	// import { formatInTimeZone } from 'date-fns-tz';
	import { navigating } from '$app/stores';
	import { onDestroy } from 'svelte';
	import { formatDate } from 'date-fns';
	import { de } from 'date-fns/locale';

	import { paused, progress, reset, start } from '$lib/stores/screen';
	import { swipe, type SwipeEvent } from '$lib/swipe';
	import { time } from '$lib/stores/time';

	import type { LayoutData } from './$types';

	const SWITCH_INTERVAL = 20000;
	const UPDATE_INTERVAL = 60000;

	export let data: LayoutData;
	$: index = data.index;
	$: timezone = data.modem?.gpsTz || data.modem?.timeTz || 'Europe/Zurich';
	$: timeStr = formatDate($time, 'HH:mm', { locale: de });
	$: tzStr = formatDate($time, 'O', { locale: de });
	$: secondStr = formatDate($time, 'ss', { locale: de });
	$: date = formatDate($time, 'd. MMMM yyyy', { locale: de });
	$: dateSub = formatDate($time, 'eeee', { locale: de }).replace('.', '');
	$: modem = data.modem;
	$: battery = data.battery;
	$: holiday = data.holiday;

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
		if (e.detail.dir === 'left' && data.nextScreen) {
			goto(data.nextScreen);
		} else if (e.detail.dir === 'right' && data.prevScreen) {
			goto(data.prevScreen);
		}
	}
</script>

<div class="container-fluid vh-100 d-flex flex-column" use:swipe={{ x: 200 }} on:swipe={onSwipe}>
	<div class="row flex-nowrap mb-2 p-1">
		<div
			role="presentation"
			class="col-auto d-flex flex-row align-items-end mt-1 p-0"
			on:click={togglePause}
		>
			<div class="time-main">{timeStr}</div>
			<div class="time-seconds align-self-stretch d-flex flex-column justify-content-between ms-1">
				<div>{secondStr}</div>
				<div class="text-muted text-nowrap">{tzStr}</div>
			</div>
		</div>

		<div class="col d-flex flex-column justify-content-end align-items-end p-0">
			<div class="row icons flex-nowrap justify-content-end">
				{#if modem?.operator}
					<div class="col-auto">
						<i class="icofont-globe" />
						{modem.operator.split(' ', 2)[0]}
					</div>
				{/if}

				{#if modem?.signal}
					<div class="col-auto">
						<i class="icofont-signal" />
						{(modem.signal / 4) * 100}%
					</div>
				{/if}

				{#if modem?.lat && modem?.lng}
					<div class="col-auto">
						<i class="icofont-satellite" />
						{modem.lat.toFixed(0)} | {modem.lng.toFixed(0)}
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

			<div class="row flex-fill" />

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
				<slot />
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
		font-size: 5rem;
		line-height: 4rem;
		font-weight: 600;
		color: var(--bs-white);
	}

	.time-seconds {
		> :first-child {
			font-size: 2.2rem;
			line-height: 1.8rem;
		}

		> :last-child {
			font-size: 1.4rem;
			line-height: 1.3rem;
		}
	}

	.icons {
		font-size: 0.6rem;
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

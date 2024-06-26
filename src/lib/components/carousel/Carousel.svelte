<script lang="ts">
	import { beforeNavigate, goto, invalidate } from '$app/navigation';
	import { fade } from 'svelte/transition';
	import { formatInTimeZone } from 'date-fns-tz';
	import { navigating } from '$app/stores';
	import { onDestroy, onMount } from 'svelte';
	import { de } from 'date-fns/locale';

	import { SERVICES } from '$lib/services';
	import type { CarouselServiceMainData } from '$lib/models/carousel';
	import { paused, progress, reset, start } from '$lib/stores/screen';
	import { swipe, type SwipeEvent } from '$lib/swipe';
	import { time } from '$lib/stores/time';
	import { tz } from '$lib/stores/tz';

	export let data: CarouselServiceMainData;
	$: index = data.index;
	$: screen = data.screen;
	$: screenType = data.screenType;
	$: screenData = data.screenData;
	$: icons = data.icons;
	$: timeStr = formatInTimeZone($time, $tz, 'HH:mm', { locale: de });
	$: tzStr = formatInTimeZone($time, $tz, 'O', { locale: de });
	$: secondStr = formatInTimeZone($time, $tz, 'ss', { locale: de });
	$: date = formatInTimeZone($time, $tz, 'd. MMMM yyyy', { locale: de });
	$: dateSub = formatInTimeZone($time, $tz, 'eeee', { locale: de }).replace('.', '');

	let timer: ReturnType<typeof setInterval> | null = null;

	$: {
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

	beforeNavigate((nav) => {
		reset(false);
		if (timer) {
			clearInterval(timer);
			timer = null;
		}
	});
	onDestroy(() => {
		reset();
		if (timer) {
			clearInterval(timer);
			timer = null;
		}
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

<div style="display: contents;" use:swipe={{ x: 200 }} on:swipe={onSwipe}>
	<div class="row flex-nowrap mb-2">
		<div
			role="presentation"
			class="col-auto d-flex flex-row align-items-end"
			on:click={togglePause}
		>
			<div class="time-main">{timeStr}</div>
			<div class="time-seconds align-self-stretch d-flex flex-column justify-content-between ms-2">
				<div>{secondStr}</div>
				<div class="text-muted text-nowrap">{tzStr}</div>
			</div>
		</div>

		<div class="col d-flex flex-column justify-content-end align-items-end">
			<div class="row icons flex-nowrap justify-content-end">
				{#each icons as icon}
					{@const comp = SERVICES[icon.type]}
					<div class="col-auto">
						<svelte:component
							this={comp}
							name={icon.name}
							action={icon.action}
							data={icon.data}
							form={null}
							isEmbedded
						/>
					</div>
				{/each}

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
				<!--{#if holiday}
					<div class="col-auto text-nowrap m-0">{holiday.name}</div>
					<div class="col-auto m-0">•</div>
				{/if}-->
				<div class="col-auto fw-bold text-white text-nowrap m-0">{dateSub}</div>
			</div>
		</div>
	</div>

	<div class="row flex-1 position-relative">
		{#key index}
			<div class="w-100 h-100 d-flex flex-column position-absolute overflow-hidden" transition:fade>
				{#if screen}
					{@const comp = SERVICES[screenType]}
					<svelte:component
						this={comp}
						name={screen.name}
						action={screen.action}
						data={screenData}
						form={null}
						isEmbedded
					/>
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

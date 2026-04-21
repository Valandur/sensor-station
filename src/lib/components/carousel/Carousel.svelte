<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { fade } from 'svelte/transition';
	import { formatInTimeZone } from 'date-fns-tz';
	import { onDestroy } from 'svelte';
	import { de } from 'date-fns/locale';
	import { navigating, page } from '$app/state';
	import { resolve } from '$app/paths';

	import { SERVICES } from '$lib/services';
	import { getProgress, isPaused, pause, reset, resume, start } from '$lib/screen.svelte';
	import { swipe, type SwipeEvent } from '$lib/swipe';
	import { time } from '$lib/stores/time';
	import { tz } from '$lib/stores/tz';
	import { getScreen } from '$lib/carousel.remote';

	import Loader from '../loader.svelte';

	let { name }: { name: string } = $props();

	let index = $derived.by(() => {
		const idxStr = page.url.searchParams.get('screen');
		const idx = idxStr ? Number(idxStr) : 0;
		return isFinite(idx) ? idx : 0;
	});

	let prom = $derived(getScreen({ srv: name, index }));
	let data = $derived(prom.current);

	let timeStr = $derived(formatInTimeZone($time, $tz, 'HH:mm', { locale: de }));
	let tzStr = $derived(formatInTimeZone($time, $tz, 'O', { locale: de }));
	let secondStr = $derived(formatInTimeZone($time, $tz, 'ss', { locale: de }));
	let date = $derived(formatInTimeZone($time, $tz, 'd. MMMM yyyy', { locale: de }));
	let dateSub = $derived(formatInTimeZone($time, $tz, 'eeee', { locale: de }).replace('.', ''));

	$effect(() => {
		if (!isPaused()) {
			const next = data?.nextScreen;
			if (next) {
				start(() => goto(next), data.switchInterval);
				return () => reset();
			}
		} else {
			const timer = setInterval(() => invalidateAll(), data?.updateInterval);
			return () => clearInterval(timer);
		}
	});

	onDestroy(() => {
		reset();
	});

	function togglePause() {
		if (isPaused()) {
			resume();
		} else {
			pause();
		}
	}

	function onSwipe(e: SwipeEvent) {
		if (e.detail.dir === 'left' && data?.nextScreen) {
			goto(data.nextScreen);
		} else if (e.detail.dir === 'right' && data?.prevScreen) {
			goto(data.prevScreen);
		}
	}
</script>

<div style="display: contents;" use:swipe={{ x: 200 }} onswipe={onSwipe}>
	<div class="row mb-2 flex-nowrap">
		<div role="presentation" class="d-flex align-items-end col-auto flex-row" onclick={togglePause}>
			<div class="time-main">{timeStr}</div>
			<div class="time-seconds align-self-stretch d-flex flex-column justify-content-between ms-2">
				<div>{secondStr}</div>
				<div class="text-muted text-nowrap">{tzStr}</div>
			</div>
		</div>

		<div class="col d-flex flex-column justify-content-end align-items-end">
			<div class="row icons justify-content-end flex-nowrap">
				{#each data?.icons as icon, i (i)}
					{@const Comp = SERVICES[icon.type]}
					<div class="col-auto">
						<Comp name={icon.name} action={icon.action} isEmbedded />
					</div>
				{/each}

				{#if isPaused()}
					<div class="col-auto">
						<i class="fa-solid fa-pause"></i>
					</div>
				{/if}
			</div>

			<div class="row flex-nowrap">
				<div class="h3 col m-0 text-nowrap">{date}</div>
			</div>

			<div class="row align-items-center flex-nowrap">
				{#if data?.holiday}
					<div class="col-auto m-0 text-nowrap">{data?.holiday.name}</div>
					<div class="col-auto m-0">•</div>
				{/if}
				<div class="fw-bold col-auto m-0 text-nowrap text-white">{dateSub}</div>
			</div>
		</div>
	</div>

	<div class="row position-relative flex-1">
		{#key index}
			{@const screen = data?.screen}
			<div class="d-flex flex-column position-absolute h-100 w-100 overflow-hidden" transition:fade>
				{#if screen}
					{@const Comp = SERVICES[data.screenType]}
					<Comp name={screen.name} action={screen.action} isEmbedded />
				{:else if !prom.loading}
					<p class="alert alert-info m-2">
						There are no screens setup! Check the
						<a class="alert-link" href={resolve(`/services/${name}/config`)}>config</a>
						to add some.
					</p>
				{/if}
			</div>
		{/key}
	</div>
</div>

<div class="progress bg-secondary" style:width={getProgress() + '%'}></div>

{#if prom.loading || navigating.to}
	<Loader />
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
</style>

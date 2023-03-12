<script lang="ts">
	import { getContextClient, mutationStore, queryStore } from '@urql/svelte';
	import type { ComponentType } from 'svelte';
	import de from 'date-fns/locale/de/index';
	import { formatInTimeZone } from 'date-fns-tz';
	import Holidays from 'date-holidays';
	import { slide } from 'svelte/transition';

	import { time } from '$lib/stores/time';
	import { paused, screen, progress } from '$lib/stores/screen';
	import { GET_GENERAL_DATA, RESTART, type GetGeneralData } from '$lib/models/general';

	import News from '$lib/components/news.svelte';
	import Calendar from '$lib/components/calendar.svelte';
	import Uploads from '$lib/components/uploads.svelte';
	import Weather from '$lib/components/weather.svelte';

	const tz = 'Europe/Zurich';
	const holidays = new Holidays('CH', 'ZH');
	const COMPONENT_MAP: { [key: string]: ComponentType } = {
		news: News,
		calendar: Calendar,
		uploads: Uploads,
		weather: Weather
	};

	$: client = getContextClient();
	$: store = queryStore<GetGeneralData>({
		query: GET_GENERAL_DATA,
		context: { additionalTypenames: ['Screen'] },
		client
	});
	$: screens = $store.data?.screens || [];
	$: batteryStatus = $store.data?.battery.status;
	$: modemStatus = $store.data?.modem.status;
	$: currScreen = screens[(($screen % screens.length) + screens.length) % screens.length];

	$: timeStr = formatInTimeZone($time, tz, 'HH:mm');
	$: holiday = holidays.isHoliday($time);
	$: date = formatInTimeZone($time, tz, 'd. MMMM', { locale: de });
	$: dateSubFormat = holiday ? 'eee' : 'eeee';
	$: dateSub = formatInTimeZone($time, tz, dateSubFormat, { locale: de }).replace('.', '');

	$: togglePause = () => {
		if ($paused) {
			screen.start();
		} else {
			screen.stop();
		}
	};

	let showToolbar = false;

	let startX = 0;
	let startY = 0;
	const touchStart = (e: TouchEvent) => {
		startX = e.changedTouches[0].clientX;
		startY = e.changedTouches[0].clientY;
	};
	const touchEnd = (e: TouchEvent) => {
		const diffX = e.changedTouches[0].clientX - startX;
		const diffY = e.changedTouches[0].clientY - startY;
		if (diffX < -200) {
			screen.next();
		} else if (diffX > 200) {
			screen.prev();
		} else if (startY < 100 && diffY > 100) {
			showToolbar = true;
		} else if (showToolbar && diffY < -100) {
			showToolbar = false;
		}
	};

	const refresh = () => window.location.reload();

	$: restart = () => {
		if (!window.confirm('Are you sure you want to restart the device?')) {
			return;
		}

		mutationStore({
			query: RESTART,
			context: { additionalTypenames: ['Screen'] },
			client
		});
	};
</script>

<div
	class="container-fluid m-0 p-1 vh-100 d-flex flex-column"
	on:touchstart={touchStart}
	on:touchend={touchEnd}
>
	<div class="row">
		<div class="col-auto" on:click={togglePause} on:keypress={togglePause}>
			<h1>{timeStr}</h1>
		</div>

		<div class="col text-end">
			<div class="row icons justify-content-end">
				{#if $paused}
					<div class="col-auto">
						<i class="icofont-ui-pause" />
					</div>
				{/if}

				{#if modemStatus}
					{#if modemStatus.operator}
						<div class="col-auto">
							<i class="icofont-globe" />
							{modemStatus.operator}
						</div>
					{/if}

					{#if modemStatus.lat && modemStatus.lng}
						<div class="col-auto">
							<i class="icofont-satellite" />
						</div>
					{/if}
				{/if}

				{#if batteryStatus}
					<div class="col-auto">
						<i class="icofont-plugin" />
						{batteryStatus.charge}%
					</div>
				{/if}
			</div>

			<div class="row justify-content-end">
				<h2 class="col m-0">{date}</h2>
			</div>

			<div class="row justify-content-end">
				{#if holiday}
					<div class="col-auto">{holiday[0].name}</div>
					<div class="col-auto">•</div>
				{/if}
				<h4 class="col-auto m-0">{dateSub}</h4>
			</div>
		</div>
	</div>

	<div class="row flex-fill" style:overflow="hidden">
		{#if currScreen}
			<svelte:component this={COMPONENT_MAP[currScreen.name]} params={currScreen.params} />
		{:else}
			<p>There are no screens setup! Check the <a href="/settings">settings</a> to add some.</p>
		{/if}
	</div>

	{#if showToolbar}
		<div class="toolbar row p-2 bg-dark border border-primary" transition:slide={{ duration: 500 }}>
			<div class="col-auto">
				<a class="btn btn-primary" href="/settings"><i class="icofont-gears" /></a>
			</div>
			<div class="col" />
			<div class="col-auto">
				<button class="btn btn-warning" on:click={refresh}><i class="icofont-refresh" /></button>
			</div>
			<div class="col-auto">
				<button class="btn btn-danger" on:click={restart}><i class="icofont-power" /></button>
			</div>
		</div>
	{/if}
</div>

<div class="progress" style:width={$progress + '%'} />

<style lang="scss">
	h1 {
		font-size: 4.8rem;
	}

	h2 {
		font-size: 2rem;
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
	}

	.progress {
		position: fixed;
		background-color: var(--theme);
		left: 0;
		bottom: 0;
		height: 2px;
	}
</style>

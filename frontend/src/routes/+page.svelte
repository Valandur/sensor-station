<script lang="ts">
	import { fade, slide } from 'svelte/transition';
	import { formatInTimeZone } from 'date-fns-tz';
	import { getContextClient, gql, mutationStore, queryStore } from '@urql/svelte';
	import de from 'date-fns/locale/de/index';
	import { browser } from '$app/environment';

	import { BATTERY_STATUS, type BatteryStatus } from '$lib/models/battery';
	import { COMPONENT_MAP } from '$lib/component';
	import { MODEM_STATUS, type ModemStatus } from '$lib/models/modem';
	import { paused, screen, progress } from '$lib/stores/screen';
	import { RESTART } from '$lib/models/actions';
	import { SCREENS, type Screen, type Screens } from '$lib/models/screen';
	import { swipe, type SwipeEvent } from '$lib/swipe';
	import { time, holiday } from '$lib/stores/time';

	const QUERY_SCREENS = gql`
		query Screens {
			...Screens
		}
		${SCREENS}
	`;
	const QUERY_STATUS = gql`
		query GeneralData {
			...BatteryStatus
			...ModemStatus
		}
		${BATTERY_STATUS}
		${MODEM_STATUS}
	`;

	const tz = 'Europe/Zurich';

	let loading = false;
	let currScreen: Screen | null = null;
	let currData: any = null;
	let currError: any = null;

	$: client = getContextClient();
	$: screenStore = queryStore<Screens>({
		query: QUERY_SCREENS,
		context: { additionalTypenames: ['Screen'] },
		requestPolicy: 'cache-and-network',
		client
	});
	$: statusStore = queryStore<BatteryStatus & ModemStatus>({
		query: QUERY_STATUS,
		requestPolicy: 'cache-and-network',
		client
	});
	function refreshData() {
		queryStore({
			query: QUERY_STATUS,
			requestPolicy: 'network-only',
			client
		});
	}
	$: $time, refreshData();

	const cachedScreens: Screen[] = browser
		? JSON.parse(window.localStorage.getItem('screens') || '[]')
		: [];
	$: screens = $screenStore.data?.screens || cachedScreens;
	$: browser && localStorage.setItem('screens', JSON.stringify(screens));
	$: batteryStatus = $statusStore.data?.battery.status;
	$: modemStatus = $statusStore.data?.modem.status;
	$: screen.setMax(screens.length);

	$: {
		if (!loading) {
			loading = true;

			const nextScreen = screens[$screen];
			const [, nextMeta] = COMPONENT_MAP[nextScreen?.name] || [];

			if (nextScreen !== currScreen && nextMeta) {
				nextMeta
					.getData(nextScreen.params)
					.then((data) => {
						if (nextMeta.skip && nextMeta.skip(nextScreen.params, data)) {
							screen.skip();
						} else {
							currError = null;
							currData = data;
							currScreen = nextScreen;
						}
					})
					.catch((err) => {
						currError = err;
						currData = null;
						currScreen = nextScreen;
					})
					.finally(() => (loading = false));
			} else {
				loading = false;
			}
		}
	}

	$: timeStr = formatInTimeZone($time, tz, 'HH:mm');
	$: date = formatInTimeZone($time, tz, 'd. MMMM', { locale: de });
	$: dateSubFormat = holiday ? 'eee' : 'eeee';
	$: dateSub = formatInTimeZone($time, tz, dateSubFormat, { locale: de }).replace('.', '');

	function togglePause() {
		if ($paused) {
			screen.start();
		} else {
			screen.stop();
		}
	}

	let showToolbar = false;

	function onSwipe(e: SwipeEvent) {
		if (e.detail.dir === 'left' && !showToolbar) {
			screen.next();
		} else if (e.detail.dir === 'right' && !showToolbar) {
			screen.prev();
		} else if (e.detail.dir === 'down' && e.detail.y.start < 100) {
			showToolbar = true;
			screen.stop();
		} else if (e.detail.dir === 'up' && showToolbar) {
			showToolbar = false;
			screen.start();
		}
	}

	function reload() {
		window.location.reload();
	}
	function restart() {
		if (!window.confirm('Are you sure you want to restart the device?')) {
			return;
		}

		mutationStore({
			query: RESTART,
			context: { additionalTypenames: ['Screen'] },
			client
		});
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
				{#if $paused}
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

				{#if batteryStatus?.status.includes('CHARGING')}
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
				{#if $holiday}
					<div class="col-auto">{$holiday.name}</div>
					<div class="col-auto">•</div>
				{/if}
				<h4 class="col-auto m-0">{dateSub}</h4>
			</div>
		</div>
	</div>

	<div class="row flex-fill position-relative">
		{#key currScreen}
			<div
				class="container h-100 w-100 m-0 p-0 position-absolute"
				style:overflow="hidden"
				transition:fade
			>
				{#if $statusStore.fetching}
					<p class="alert alert-info m-2">
						<i class="icofont-spinner" /> Loading...
					</p>
				{:else if currScreen}
					{#if currScreen.name in COMPONENT_MAP}
						{#if currData}
							{@const [comp] = COMPONENT_MAP[currScreen.name]}
							<svelte:component this={comp} params={currScreen.params} data={currData} />
						{:else}
							<p class="alert alert-danger m-2">
								Error loading screen '{currScreen.name}': {currError}
							</p>
						{/if}
					{:else}
						<p class="alert alert-danger m-2">Unknown screen type '{currScreen.name}'</p>
					{/if}
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
				<button class="btn btn-danger" on:click={restart}>
					<i class="icofont-power icofont-2x" />
				</button>
			</div>
		</div>
	{/if}
</div>

<div class="progress bg-secondary" style:width={$progress + '%'} />

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
</style>

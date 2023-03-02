<script lang="ts">
	import { getContextClient, queryStore } from '@urql/svelte';
	import type { ComponentType } from 'svelte';
	import de from 'date-fns/locale/de/index';
	import { formatInTimeZone } from 'date-fns-tz';
	import Holidays from 'date-holidays';
	import { slide } from 'svelte/transition';

	import { time } from '$lib/stores/time';
	import { paused, screen, progress } from '$lib/stores/screen';
	import { GET_DATA, type GetData } from '$lib/models/general';

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
	$: store = queryStore<GetData>({
		query: GET_DATA,
		context: { additionalTypenames: ['Screen'] },
		client
	});
	$: screens = $store.data?.screens || [];
	$: battery = $store.data?.battery;
	$: modem = $store.data?.modem;
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
</script>

<div class="container" on:touchstart={touchStart} on:touchend={touchEnd}>
	<div class="header">
		<div class="left" on:click={togglePause} on:keypress={togglePause}>{timeStr}</div>
		<div class="right">
			<div class="symbols">
				{#if battery}
					<div class="battery">
						<div class="charge" style:width={battery.charge + '%'}>
							{#if battery.batteryStatus.includes('CHARGING')}
								<i class="icofont-plugin" />
							{/if}
							{battery.charge}%
						</div>
					</div>
				{/if}

				{#if modem}
					{#if modem.operator}
						<div class="mobile">
							<div
								style:height="25%"
								style:background-color={modem.signal > 0 ? 'orange' : 'gray'}
							/>
							<div
								style:height="50%"
								style:background-color={modem.signal > 1 ? 'orange' : 'gray'}
							/>
							<div
								style:height="75%"
								style:background-color={modem.signal > 2 ? 'orange' : 'gray'}
							/>
							<div
								style:height="100%"
								style:background-color={modem.signal > 3 ? 'orange' : 'gray'}
							/>
						</div>

						<div><i class="icofont-globe" /> {modem.operator}</div>
					{/if}

					{#if modem.lat && modem.lng}
						<i class="icofont-satellite" />
					{/if}
				{/if}

				{#if $paused}
					<i class="icofont-ui-pause" />
				{/if}
			</div>
			<div class="date-main">{date}</div>
			<div class="date-sub">
				<div>{dateSub}</div>
				{#if holiday}
					<div>&nbsp;•&nbsp;{holiday[0].name}</div>
				{/if}
			</div>
		</div>
	</div>

	{#if currScreen}
		<svelte:component this={COMPONENT_MAP[currScreen.name]} params={currScreen.params} />
	{:else}
		<p>There are no screens setup! Check the <a href="/settings">settings</a> to add some.</p>
	{/if}

	{#if showToolbar}
		<div class="toolbar" transition:slide={{ duration: 500 }}>
			<a href="/settings"><i class="icofont-gears" /></a>
		</div>
	{/if}
</div>

<div class="progress" style:width={$progress + '%'} />

<style>
	.container {
		height: 100vh;
		width: 100vw;
		display: flex;
		flex-direction: column;
		padding: 0.3rem;
		box-sizing: border-box;
	}

	.header {
		display: flex;
		flex-direction: row;
		align-items: stretch;
		margin-bottom: 0.5rem;
	}

	.header > .left {
		font-size: 5rem;
		line-height: 5rem;
		padding-right: 1rem;
	}

	.header > .right {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		overflow-x: hidden;
	}

	.date-main {
		font-size: 2rem;
	}

	.date-sub {
		display: flex;
		flex-direction: row;
		font-size: 1rem;
		white-space: nowrap;
	}

	.symbols {
		display: flex;
		flex-direction: row-reverse;
		align-items: center;
		font-size: 0.6rem;
		height: 0.8rem;
	}

	.symbols > * {
		margin-left: 0.5rem;
	}

	.mobile {
		display: flex;
		flex-direction: row;
		align-items: flex-end;
		height: 100%;
	}

	.mobile > div {
		width: 0.5rem;
		margin-right: 0.1rem;
	}

	.battery {
		width: 3rem;
		background-color: gray;
		height: 100%;
	}

	.battery > .charge {
		color: black;
		background-color: orange;
		white-space: nowrap;
		line-height: 0.8rem;
		height: 100%;
	}

	.toolbar {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		background-color: black;
		border-bottom: 1px solid orange;
		box-sizing: border-box;
		overflow: hidden;
		display: flex;
		flex-direction: row;
	}

	.toolbar > a {
		color: orange;
		text-decoration: none;
		font-size: 2rem;
		padding: 0.5rem;
	}

	.progress {
		position: fixed;
		background-color: gray;
		left: 0;
		bottom: 0;
		height: 2px;
	}
</style>

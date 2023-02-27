<script lang="ts">
	import { createClient, setContextClient } from '@urql/svelte';
	import de from 'date-fns/locale/de/index';
	import { formatInTimeZone } from 'date-fns-tz';
	import Holidays from 'date-holidays';

	import { time } from '$lib/stores/time';

	const client = createClient({
		url: 'http://localhost:2000/graphql',
		fetchOptions: { credentials: 'include' }
	});
	setContextClient(client);

	const tz = 'Europe/Zurich';
	const holidays = new Holidays('CH', 'ZH');

	$: timeStr = formatInTimeZone($time, tz, 'HH:mm');
	$: holiday = holidays.isHoliday($time);
	$: date = formatInTimeZone($time, tz, 'd. MMMM', { locale: de });
	$: dateSubFormat = holiday ? 'eee' : 'eeee';
	$: dateSub = formatInTimeZone($time, tz, dateSubFormat, { locale: de }).replace('.', '');
</script>

<div class="container">
	<div class="header">
		<div class="left">{timeStr}</div>
		<div class="right">
			<div class="symbols" />
			<div class="date-main">{date}</div>
			<div class="date-sub">
				<div>{dateSub}</div>
				{#if holiday}
					<div>&nbsp;•&nbsp;{holiday[0].name}</div>
				{/if}
			</div>
		</div>
	</div>
	<slot />
	<div class="progress" style="width: 33%" />
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		font-family: Roboto, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		background-color: black;
		color: orange;
	}

	.container {
		height: 100vh;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
	}

	.progress {
		position: absolute;
		background-color: gray;
		left: 0;
		bottom: 0;
		height: 2px;
	}

	.header {
		display: flex;
		flex-direction: row;
		align-items: stretch;
		padding-left: 10px;
		padding-right: 10px;
		margin-bottom: 20px;
	}

	.header > .left {
		font-size: 150px;
		padding-right: 30px;
	}

	.header > .right {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		overflow-x: hidden;
		padding-top: 10px;
	}

	.date-main {
		font-size: 60px;
		padding-top: 10px;
	}

	.date-sub {
		display: flex;
		flex-direction: row;
		font-size: 30px;
		white-space: nowrap;
	}

	.symbols {
		display: flex;
		flex-direction: row-reverse;
		align-items: center;
		height: 20px;
	}
</style>

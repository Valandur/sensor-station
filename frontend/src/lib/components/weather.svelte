<script lang="ts">
	import { getContextClient, queryStore } from '@urql/svelte';
	import { format, formatDistanceToNow, parseISO } from 'date-fns';
	import de from 'date-fns/locale/de/index';

	import { GET_WEATHER_AND_SENSORS, type GetWeatherAndSensorsData } from '$lib/models/_combined';

	export let params: string = '';
	params; // svelte hack to disable unused variable warning

	const NUM_FORECASTS = 6;

	$: store = queryStore<GetWeatherAndSensorsData>({
		query: GET_WEATHER_AND_SENSORS,
		context: { additionalTypenames: ['WeatherForecast', 'WeatherAlert'] },
		requestPolicy: 'cache-and-network',
		client: getContextClient()
	});

	$: newestRecording = $store.data?.sensors.newest;
	$: numDailyForecasts = NUM_FORECASTS - (newestRecording ? 1 : 0);
	$: dailyForecasts = $store.data?.weather.daily?.slice(0, numDailyForecasts) || [];
</script>

<div class="container">
	{#if newestRecording}
		<div class="sensors">
			<div />
			<div class="text" style:color="#23ad00">{newestRecording.temp.toFixed(0)}°</div>
			<div class="text" style:color="#0052d6">{newestRecording.rh.toFixed(0)}%</div>
			<div class="info">
				{formatDistanceToNow(parseISO(newestRecording.ts), { addSuffix: true })}
			</div>
		</div>
	{/if}

	<div class="forecasts">
		{#each dailyForecasts as forecast}
			<div class="forecast">
				<div class="text">{format(parseISO(forecast.ts), 'iiiiii', { locale: de })}</div>
				<img src={forecast.img} alt="Weather icon" />
				<div class="text" style="color: #23ad00">{forecast.feelsLike.toFixed(0)}°</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.container {
		flex: 1;
		display: flex;
		flex-direction: row;
	}

	.sensors {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		align-items: center;
	}

	.sensors > .text {
		font-size: 3rem;
		text-align: center;
	}

	.sensors > .info {
		color: gray;
		font-size: 0.5rem;
	}

	.forecasts {
		flex: 3;
		display: flex;
		flex-direction: row;
		justify-content: space-evenly;
		align-items: stretch;
	}

	.forecast {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		align-items: center;
	}

	.forecast > img {
		width: 90%;
	}

	.forecast > .text {
		font-size: 2.5rem;
		text-align: center;
	}
</style>

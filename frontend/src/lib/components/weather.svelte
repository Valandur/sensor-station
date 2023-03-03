<script lang="ts">
	import { getContextClient, queryStore } from '@urql/svelte';
	import { format, formatDistanceToNow, parseISO } from 'date-fns';
	import de from 'date-fns/locale/de/index';

	import { type GetWeatherData, GET_WEATHER } from '$lib/models/weather';

	export let params: string = '';
	params; // svelte hack to disable unused variable warning

	const NUM_FORECASTS = 6;

	$: store = queryStore<GetWeatherData>({
		query: GET_WEATHER,
		context: { additionalTypenames: ['WeatherForecast', 'WeatherAlert'] },
		requestPolicy: 'cache-and-network',
		client: getContextClient()
	});

	$: sensors = $store.data?.sensors;
	$: numForecasts = NUM_FORECASTS - (sensors ? 1 : 0);
	$: forecasts = $store.data?.forecasts?.slice(0, numForecasts) || [];
</script>

<div class="container">
	{#if sensors}
		<div class="sensors">
			<div />
			<div class="text" style:color="#23ad00">{sensors.temp.toFixed(0)}°</div>
			<div class="text" style:color="#0052d6">{sensors.rh.toFixed(0)}%</div>
			<div class="info">{formatDistanceToNow(parseISO(sensors.ts), { addSuffix: true })}</div>
		</div>
	{/if}

	<div class="forecasts">
		{#each forecasts as forecast}
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

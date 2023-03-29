<script lang="ts" context="module">
	export const weatherMeta: ComponentMeta<GetWeatherAndSensorsData> = {
		getData: async () => {
			const client = getClient();
			const res = await client
				.query<GetWeatherAndSensorsData>(
					GET_WEATHER_AND_SENSORS,
					{},
					{
						additionalTypenames: ['WeatherForecast', 'WeatherAlert'],
						requestPolicy: 'cache-and-network'
					}
				)
				.toPromise();
			if (res.error) {
				throw res.error;
			}
			return res.data || null;
		}
	};
</script>

<script lang="ts">
	import { format, formatDistanceToNow, parseISO } from 'date-fns';
	import de from 'date-fns/locale/de/index';

	import { GET_WEATHER_AND_SENSORS, type GetWeatherAndSensorsData } from '$lib/models/_combined';
	import { getClient } from '$lib/client';
	import type { ComponentMeta } from '$lib/component';

	export let params: string = '';
	export let data: GetWeatherAndSensorsData;

	const NUM_FORECASTS = 7;

	$: isHourly = params === 'hourly';

	$: newestRecording = data.sensors.newest;
	$: numForecasts = NUM_FORECASTS - (newestRecording ? 2 : 0);

	$: weather = data.weather;
	$: list = isHourly ? weather?.hourly?.slice(1).filter((_, i) => i % 2 === 0) : weather?.daily;
	$: forecasts = list?.slice(0, numForecasts) || [];
	$: labelFormat = isHourly ? "HH''" : 'iiiiii';
</script>

<div class="container-fluid h-100 m-0">
	<div class="row">
		{#if newestRecording}
			<div class="col-3 d-flex flex-column justify-content-center align-items-center">
				<div class="row text" style:color="#23ad00">{newestRecording.temp.toFixed(0)}°</div>
				<div class="row text" style:color="#0052d6">{newestRecording.rh.toFixed(0)}%</div>
				<div class="row info mt-2">
					{formatDistanceToNow(parseISO(newestRecording.ts), { addSuffix: true })}
				</div>
			</div>
		{/if}

		<div class="col">
			<div class="row row-cols-5">
				{#each forecasts as forecast}
					<div class="col">
						<div class="text">{format(parseISO(forecast.ts), labelFormat, { locale: de })}</div>
						<img src={forecast.img} alt="Weather icon" />
						<div class="text" style="color: #23ad00">{forecast.feelsLike.toFixed(0)}°</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
	.text {
		font-size: 3rem;
		text-align: center;
	}

	.info {
		color: gray;
		font-size: 0.6rem;
	}

	img {
		width: 100%;
	}
</style>

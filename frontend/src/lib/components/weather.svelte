<script lang="ts" context="module">
	type WeatherAndSensors =
		| ({ type: 'daily' } & WeatherDaily & SensorsNewest)
		| ({ type: 'hourly' } & WeatherHourly & SensorsNewest)
		| ({ type: 'alerts' } & WeatherAlerts);
	const QUERY_DAILY = gql`
		query WeatherAndSensorsNewest {
			...WeatherDaily
			...SensorsNewest
		}
		${WEATHER_DAILY}
		${SENSORS_NEWEST}
	`;
	const QUERY_HOURLY = gql`
		query WeatherAndSensorsNewest {
			...WeatherHourly
			...SensorsNewest
		}
		${WEATHER_HOURLY}
		${SENSORS_NEWEST}
	`;
	const QUERY_ALERTS = gql`
		query WeatherAndSensorsNewest {
			...WeatherAlerts
		}
		${WEATHER_ALERTS}
	`;

	export const weatherMeta: ComponentMeta<WeatherAndSensors> = {
		getData: async (param) => {
			const query =
				param === 'alerts' ? QUERY_ALERTS : param === 'hourly' ? QUERY_HOURLY : QUERY_DAILY;

			const client = getClient();
			const res = await client
				.query<WeatherAndSensors>(
					query,
					{},
					{
						additionalTypenames: ['WeatherForecast', 'WeatherAlerts', 'SensorRecording'],
						requestPolicy: 'cache-and-network'
					}
				)
				.toPromise();
			if (res.error) {
				throw res.error;
			}
			if (!res.data) {
				throw new Error('Could not get data for weather');
			}
			return { ...res.data, type: param as any };
		},
		skip: (params, data) => {
			return data.type === 'alerts' && data.weather.alerts?.length === 0;
		}
	};
</script>

<script lang="ts">
	import { onDestroy } from 'svelte';
	import { gql } from '@urql/svelte';
	import { format, formatDistanceToNow, parseISO } from 'date-fns';
	import de from 'date-fns/locale/de/index';

	import {
		WEATHER_ALERTS,
		WEATHER_DAILY,
		WEATHER_HOURLY,
		type WeatherAlert,
		type WeatherAlerts,
		type WeatherDaily,
		type WeatherForecast,
		type WeatherHourly
	} from '$lib/models/weather';
	import { getClient } from '$lib/client';
	import { getStore } from '$lib/stores/counter';
	import { screen } from '$lib/stores/screen';
	import { SENSORS_NEWEST, type SensorsNewest } from '$lib/models/sensors';
	import { swipe } from '$lib/swipe';
	import type { ComponentMeta } from '$lib/component';

	export let params: string = '';
	params; // svelte hack to disable unused variable warning
	export let data: WeatherAndSensors;

	const NUM_FORECASTS = 7;

	$: newestRecording = data.type !== 'alerts' ? data.sensors.newest : null;
	$: numForecasts = NUM_FORECASTS - (newestRecording ? 2 : 0);
	$: index = getStore(
		'weather-alerts',
		data.type === 'alerts' ? data.weather.alerts?.length : null
	);

	let labelFormat = '';
	let alert: WeatherAlert | null = null;
	let forecasts: WeatherForecast[] = [];
	$: {
		if (data.type === 'alerts') {
			alert = data.weather.alerts?.[$index] || null;
			forecasts = [];
		} else if (data.type === 'hourly') {
			alert = null;
			forecasts =
				data.weather.hourly
					?.slice(1)
					.filter((_, i) => i % 2 === 0)
					.slice(0, numForecasts) || [];
			labelFormat = "HH''";
		} else {
			alert = null;
			forecasts = data.weather.daily?.slice(0, numForecasts) || [];
			labelFormat = 'iiiiii';
		}
	}

	onDestroy(async () => {
		if (data.type === 'alerts') {
			index.increment();
		}
	});
</script>

<div
	class="container-fluid h-100 m-0 d-flex flex-column justify-content-{alert ? 'end' : 'center'}"
	use:swipe={{ y: 100 }}
	on:swipe={(e) => {
		screen.reset();
		e.detail.dir === 'up' ? index.increment() : index.decrement();
	}}
>
	<div class="row mh-100">
		{#if alert}
			<div class="col-1" />
			<div class="col-10 mh-100">
				<div class="card bg-warning border-warning bg-opacity-25 h-100">
					<div class="card-header border-warning fw-bold small d-flex justify-content-between">
						<div>
							{alert.tags}
						</div>
						<div>
							<i class="icofont-calendar" />
							{format(parseISO(alert.start), 'dd.MM.yy HH:mm')} -
							{format(parseISO(alert.end), 'dd.MM.yy HH:mm')}
						</div>
					</div>
					<div class="card-body overflow-scroll">
						<h5 class="card-title">
							{alert.event}
						</h5>
						<h6 class="card-subtitle mb-2 text-white text-opacity-50">
							{alert.sender}
						</h6>
						<ul class="m-0 p-0 ms-3">
							{#each alert.content.split('\n') as line}
								<li>{line.substring(2)}</li>
							{/each}
						</ul>
					</div>

					<div class="card-arrow">
						<div class="card-arrow-top-left" />
						<div class="card-arrow-top-right" />
						<div class="card-arrow-bottom-left" />
						<div class="card-arrow-bottom-right" />
					</div>
				</div>
			</div>
			<div class="col-1" />
		{:else}
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
		{/if}
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

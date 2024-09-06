<script lang="ts">
	import { formatInTimeZone } from 'date-fns-tz';
	import { de } from 'date-fns/locale';

	import { tz } from '$lib/stores/tz';
	import type { WeatherServiceHourlyData } from '$lib/models/weather';

	import Marker from './Marker.svelte';

	export let data: WeatherServiceHourlyData;
	$: location = data.location;
	$: hourly = data.hourly;
</script>

<Marker {location} />

<div class="row flex-1"></div>

<div class="row flex-nowrap">
	{#each hourly as forecast}
		<div class="col d-flex flex-column justify-content-between align-items-center">
			<div class="text">{formatInTimeZone(forecast.ts, $tz, "HH''", { locale: de })}</div>
			<img src={forecast.img} alt="Weather icon" />
			<div class="text" style="color: #23ad00">{forecast.feelsLike.toFixed(0)}°</div>
		</div>
	{/each}
</div>

<style>
	.text {
		font-size: 2.5em;
	}

	img {
		width: 100%;
	}
</style>

<script lang="ts">
	import { formatInTimeZone } from 'date-fns-tz';
	import { de } from 'date-fns/locale';

	import { tz } from '$lib/stores/tz';
	import type { WeatherForecast, WeatherLocation } from '$lib/models/weather';

	import Marker from './Marker.svelte';

	export let location: WeatherLocation;
	export let daily: WeatherForecast[];
</script>

<Marker {location} />

<div class="row flex-1"></div>

<div class="row flex-nowrap">
	{#each daily as forecast}
		<div class="col d-flex flex-column justify-content-between align-items-center">
			<div class="text">{formatInTimeZone(forecast.ts, $tz, 'iiiiii', { locale: de })}</div>
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

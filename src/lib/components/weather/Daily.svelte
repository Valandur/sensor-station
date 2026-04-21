<script lang="ts">
	import { formatInTimeZone } from 'date-fns-tz';
	import { de } from 'date-fns/locale';

	import { tz } from '$lib/stores/tz';
	import { getDailyWeather } from '$lib/weather.remote';

	import Loader from '../loader.svelte';
	import ErrorCard from '../error-card.svelte';

	import Marker from './maker.svelte';

	let { name }: { name: string } = $props();
</script>

{#await getDailyWeather({ srv: name })}
	<Loader />
{:then { location, daily }}
	<Marker {location} />

	<div class="row flex-1"></div>

	<div class="row flex-nowrap">
		{#each daily as forecast, i (i)}
			<div class="col d-flex flex-column justify-content-between align-items-center">
				<div class="text">{formatInTimeZone(forecast.ts, $tz, 'iiiiii', { locale: de })}</div>
				<img src={forecast.img} alt="Weather icon" />
				<div class="text" style="color: #23ad00">{forecast.feelsLike.toFixed(0)}°</div>
			</div>
		{/each}
	</div>
{:catch err}
	<ErrorCard message="Error loading weather" params={err} />
{/await}

<style>
	.text {
		font-size: 2.5em;
	}

	img {
		width: 100%;
	}
</style>

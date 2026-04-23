<script lang="ts">
	import { formatInTimeZone } from 'date-fns-tz';
	import { de } from 'date-fns/locale';

	import { tz } from '$lib/stores/tz';
	import { getHourlyWeather } from '$lib/weather.remote';

	import Loader from '../loader.svelte';
	import ErrorCard from '../error-card.svelte';

	import Marker from './maker.svelte';

	let { name }: { name: string } = $props();
</script>

<svelte:boundary>
	{@const { location, hourly } = await getHourlyWeather({ srv: name })}

	<Marker {location} />

	<div class="row flex-1"></div>

	<div class="row flex-nowrap">
		{#each hourly as forecast, i (i)}
			<div class="col d-flex flex-column justify-content-between align-items-center">
				<div class="text">{formatInTimeZone(forecast.ts, $tz, "HH''", { locale: de })}</div>
				<img src={forecast.img} alt="Weather icon" />
				<div class="text" style="color: #23ad00">{forecast.feelsLike.toFixed(0)}°</div>
			</div>
		{/each}
	</div>

	{#snippet pending()}
		<Loader />
	{/snippet}

	{#snippet failed(error)}
		<ErrorCard message="Error loading hourly weather" params={{ error }} />
	{/snippet}
</svelte:boundary>

<style>
	.text {
		font-size: 2.5em;
	}

	img {
		width: 100%;
	}
</style>

<script lang="ts">
	import { format, parseISO } from 'date-fns';
	import { de } from 'date-fns/locale';

	import type { PageData } from './$types';

	export let data: PageData;

	const NUM_FORECASTS = 5;

	$: weather = data.weather;
	$: temp = weather?.temp;
	$: rh = weather?.rh;

	$: numForecasts = NUM_FORECASTS - (temp || rh ? 2 : 0);
	$: forecasts = weather?.forecasts.slice(0, numForecasts) || [];
</script>

<div class="container">
	<div class="sensors">
		<div class="text" style="color: #23ad00">{temp?.toFixed(0)}°</div>
		<div class="text" style="color: #0052d6">{rh?.toFixed(0)}%</div>
	</div>

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
		font-size: 100px;
		text-align: center;
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
		width: 80%;
	}

	.forecast > .text {
		font-size: 80px;
		text-align: center;
	}
</style>

<script lang="ts">
	import { format } from 'date-fns';
	import de from 'date-fns/locale/de/index';

	import type { PageData } from './$types';

	export let data: PageData;
	$: loc = data.location;
	$: forecasts = data.daily;
</script>

<div class="h-100 d-flex flex-column justify-content-end">
	<div class="row d-flex flex-row justify-content-end">
		<div class="col-auto text-muted">
			<i class="icofont-location-pin" />
			{#if loc.place}
				{loc.place.name}, {loc.place.state}, {loc.place.country}
			{:else}
				{loc.lat}, {loc.lng}
			{/if}
		</div>
	</div>
	<div class="row">
		{#each forecasts as forecast}
			<div class="col d-flex flex-column justify-content-between align-items-center">
				<div class="text">{format(forecast.ts, 'iiiiii', { locale: de })}</div>
				<img src={forecast.img} alt="Weather icon" />
				<div class="text" style="color: #23ad00">{forecast.feelsLike.toFixed(0)}°</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.text {
		font-size: 2.8rem;
	}

	img {
		width: 100%;
	}
</style>

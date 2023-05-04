<script lang="ts">
	import { format } from 'date-fns';
	import de from 'date-fns/locale/de/index';

	import type { PageData } from './$types';

	export let data: PageData;
	$: forecasts = data.daily;
</script>

<div class="container-fluid h-100 m-0 d-flex flex-column justify-content-center">
	<div class="row">
		<div class="col">
			<div class="row">
				{#each forecasts as forecast}
					<div class="col">
						<div class="text">{format(forecast.ts, 'iiiiii', { locale: de })}</div>
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

	img {
		width: 100%;
	}
</style>

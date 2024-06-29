<script lang="ts">
	import type { WeatherLocation } from '$lib/models/weather';

	export let location: WeatherLocation;
</script>

<div class="row justify-content-end">
	<div class="col-auto text-muted">
		<i class="fa-solid fa-map-location-dot"></i>
		{#if location.place}
			{location.place}
		{:else}
			{location.lat}, {location.lng}
		{/if}
	</div>
</div>

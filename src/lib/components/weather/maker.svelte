<script lang="ts">
	import type { WeatherLocation } from '$lib/models/weather';

	let { location }: { location: WeatherLocation } = $props();
</script>

<div class="row justify-content-end">
	<div class="text-muted col-auto">
		<i class="fa-solid fa-map-location-dot"></i>
		{#if location.place}
			{location.place}
		{:else}
			{location.lat}, {location.lng}
		{/if}
	</div>
</div>

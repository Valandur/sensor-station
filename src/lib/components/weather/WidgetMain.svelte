<script lang="ts">
	import type {
		WeatherAlert,
		WeatherForecast,
		WeatherLocation,
		WeatherWidgetType
	} from '$lib/models/weather';

	import WidgetAlerts from './WidgetAlerts.svelte';
	import WidgetDaily from './WidgetDaily.svelte';
	import WidgetHourly from './WidgetHourly.svelte';

	export let type: WeatherWidgetType;
	export let location: WeatherLocation;
	export let daily: WeatherForecast[];
	export let hourly: WeatherForecast[];
	export let alert: WeatherAlert;
</script>

{#if type === 'daily'}
	<WidgetDaily {location} {daily} />
{:else if type === 'hourly'}
	<WidgetHourly {location} {hourly} />
{:else if type === 'alerts'}
	<WidgetAlerts {location} {alert} />
{/if}

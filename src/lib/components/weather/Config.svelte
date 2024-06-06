<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import type { CalendarServiceConfig } from '$lib/models/calendar';

	export let name: string;
	export let config: CalendarServiceConfig;
</script>

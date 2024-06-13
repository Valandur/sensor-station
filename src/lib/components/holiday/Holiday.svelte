<script lang="ts">
	import type { HolidaysTypes } from 'date-holidays';

	export let holiday: HolidaysTypes.Holiday | null;
</script>

Current holiday:
{#if holiday}
	{holiday.name}
{:else}
	No holiday
{/if}

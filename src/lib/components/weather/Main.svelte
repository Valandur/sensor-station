<script lang="ts">
	import { isSameDay } from 'date-fns';
	import { formatInTimeZone } from 'date-fns-tz';
	import { de } from 'date-fns/locale';

	import EmptyCard from '$lib/components/EmptyCard.svelte';
	import { tz } from '$lib/stores/tz';
</script>

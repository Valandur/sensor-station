<script lang="ts">
	import { de } from 'date-fns/locale/de';
	import { format } from 'date-fns/format';

	import type { SbbAlert } from '$lib/models/sbb-alerts';

	import Card from '../Card.svelte';
	import EmptyCard from '../EmptyCard.svelte';

	export let alert: SbbAlert;

	$: summary = alert?.summary?.replace('Einschränkung', '').trim() || '';
	$: description = alert?.description?.replace('Linien', '').trim() || '';
	$: reason = alert?.reason?.replace('Grund:', '').trim() || '';
	$: duration =
		alert?.duration
			?.replace('Dauer:', '')
			.replaceAll(`${format(new Date(), 'dd.MM.yyyy', { locale: de })},`, '')
			.trim() || '';
</script>

<div class="row flex-1"></div>

{#if alert}
	<div class="row">
		<div class="col">
			<Card type="warning">
				<svelte:fragment slot="header">
					<div>
						{reason}
					</div>
					<div>
						<i class="icofont-clock-time" />
						{duration}
					</div>
				</svelte:fragment>

				<svelte:fragment slot="title">
					{summary}
				</svelte:fragment>

				<svelte:fragment slot="subTitle">
					{description}
				</svelte:fragment>

				{alert.consequence}
			</Card>
		</div>
	</div>
{:else}
	<EmptyCard>Keine Einschränkungen im Betrieb der SBB</EmptyCard>
{/if}

<script lang="ts">
	import { format } from 'date-fns';
	import { goto } from '$app/navigation';
	import de from 'date-fns/locale/de/index';

	import { swipe } from '$lib/swipe';

	import type { PageData } from './$types';

	export let data: PageData;
	$: games = data.games;
</script>

<div
	class="container-fluid h-100 m-0 d-flex flex-column justify-content-end"
	use:swipe={{ y: 100 }}
	on:swipe={(e) => goto(e.detail.dir === 'up' ? data.nextPage : data.prevPage)}
>
	<div class="row row-cols-2">
		{#each games as game}
			<div class="col">
				<div class="card">
					<div class="card-header fw-bold d-flex justify-content-between">
						<div>
							{format(game.startsAt, 'dd MMM')} - {format(game.endsAt, 'dd MMM', { locale: de })}
						</div>
						<div>Free</div>
					</div>

					<div class="card-body p-1 overflow-hidden">
						<img src={game.image} class="card-img" alt={game.title} />
					</div>

					<div class="card-arrow">
						<div class="card-arrow-top-left" />
						<div class="card-arrow-top-right" />
						<div class="card-arrow-bottom-left" />
						<div class="card-arrow-bottom-right" />
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>

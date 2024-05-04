<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	$: waterLevel = data.info.waterLevel;
</script>

<div class="h-100 d-flex flex-column justify-content-end">
	<div class="row">
		<div class="col">
			<div class="card bg-theme border-theme bg-opacity-25">
				<div class="card-header border-theme fw-bold small d-flex justify-content-between">
					{waterLevel}
				</div>
				<div class="card-body">
					<p class="display-6">Fertig</p>
				</div>

				<div class="card-arrow">
					<div class="card-arrow-top-left" />
					<div class="card-arrow-top-right" />
					<div class="card-arrow-bottom-left" />
					<div class="card-arrow-bottom-right" />
				</div>
			</div>
		</div>
	</div>
</div>

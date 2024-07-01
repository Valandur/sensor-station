<script lang="ts">
	export let resultCacheTime: number = 0;
	export let errorCacheTime: number = 0;
</script>

<div class="row mb-2">
	<label for="inputResult" class="col-4 col-form-label">Result cache time (seconds)</label>
	<div class="col">
		<input
			id="inputResult"
			type="number"
			name="resultCacheTime"
			step="any"
			class="form-control"
			bind:value={resultCacheTime}
		/>
	</div>
</div>

<div class="row mb-2">
	<label for="inputLat" class="col-4 col-form-label">Error cache time (seconds)</label>
	<div class="col">
		<input
			id="inputError"
			type="number"
			name="errorCacheTime"
			step="any"
			class="form-control"
			bind:value={errorCacheTime}
		/>
	</div>
</div>

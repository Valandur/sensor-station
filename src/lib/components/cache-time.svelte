<script lang="ts">
	let {
		resultCacheTime = 0,
		errorCacheTime = 0
	}: { resultCacheTime?: number | undefined; errorCacheTime?: number | undefined } = $props();
</script>

<div class="row mb-2">
	<label for="inputResult" class="col-form-label col-4">Result cache time (seconds)</label>
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
	<label for="inputLat" class="col-form-label col-4">Error cache time (seconds)</label>
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

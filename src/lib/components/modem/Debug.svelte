<script lang="ts">
	import { enhance } from '$app/forms';

	import type { ModemServiceDebugData } from '$lib/models/modem';

	export let data: ModemServiceDebugData;
</script>

<form id="form" method="POST" class="tab-content flex-1 pt-3" use:enhance>
	<input type="text" name="cmd" placeholder="Command" class="input input-theme" />
	<button type="submit" class="btn btn-theme btn-sm">Execute</button>
</form>

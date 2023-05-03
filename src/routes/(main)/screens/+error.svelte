<script lang="ts">
	import { page } from '$app/stores';

	$: pageName = $page.route.id?.substring($page.route.id.indexOf('/screens') + 8);
</script>

<div class="alert alert-danger m-2">
	<h4 class="alert-heading">Error in {pageName}</h4>
	<p>
		{$page.error?.message}
	</p>
</div>

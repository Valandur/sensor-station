<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="container-fluid m-0 p-1 vh-100 d-flex flex-column">
	<div class="row">
		<div class="col-auto">
			<h1>Main</h1>
		</div>
		<div class="col-auto">
			<a class="btn btn-sm btn-outline-danger" href="/">
				<i class="icofont-ui-close" />
			</a>
		</div>
	</div>

	<div class="alert alert-danger m-2">
		<h4 class="alert-heading">Error</h4>
		<p>
			{$page.error?.message}
		</p>
	</div>
</div>

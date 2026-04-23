import { page } from '$app/state';

// eslint-disable-next-line prefer-const
let pageNr = $derived.by(() => {
	const pageStr = page.url.searchParams.get('page');
	if (!pageStr) {
		return null;
	}
	const pageNr = Number(pageStr);
	if (!isFinite(pageNr)) {
		return null;
	}
	return pageNr;
});

export function getPageNr() {
	return pageNr;
}

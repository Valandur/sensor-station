import { readable } from 'svelte/store';

import { browser } from '$app/environment';

export const time = readable(new Date(), (set) => {
	if (!browser) {
		return;
	}

	const interval = setInterval(() => {
		set(new Date());
	}, 30000);

	return function stop() {
		clearInterval(interval);
	};
});

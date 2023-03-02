import { readable } from 'svelte/store';

export const time = readable(new Date(), (set) => {
	const interval = setInterval(() => {
		set(new Date());
	}, 30000);

	return function stop() {
		clearInterval(interval);
	};
});

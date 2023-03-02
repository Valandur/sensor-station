import { readable } from 'svelte/store';

export const time = readable(new Date(), (set) => {
	const interval = setInterval(() => {
		set(new Date());
	}, 30000);

	set(new Date());

	return function stop() {
		clearInterval(interval);
	};
});

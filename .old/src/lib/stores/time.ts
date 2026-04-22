import { readable } from 'svelte/store';

const UPDATE_INTERVAL = 1000;

export const time = readable(new Date(), (set) => {
	const interval = setInterval(() => {
		set(new Date());
	}, UPDATE_INTERVAL);

	return function stop() {
		clearInterval(interval);
	};
});

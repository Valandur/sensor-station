import { readable } from 'svelte/store';

const UPDATE_INTERVAL = 10000;

export const time = readable(new Date(), (set) => {
	const interval = setInterval(() => {
		set(new Date());
	}, UPDATE_INTERVAL);

	set(new Date());

	return function stop() {
		clearInterval(interval);
	};
});

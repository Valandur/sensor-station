import { writable } from 'svelte/store';

function createStore() {
	const { subscribe, update } = writable(0);

	let max = 1;

	return {
		subscribe,
		setMax: (newMax: number) => (max = newMax),
		increment: () => update((n) => (n + 1) % max),
		decrement: () => update((n) => (n <= 0 ? max : n) - 1)
	};
}

export const index = createStore();

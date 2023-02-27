import { writable } from 'svelte/store';

function createStore() {
	const { subscribe, update } = writable(0);

	return {
		subscribe,
		increment: () => update((n) => n + 1),
		decrement: () => update((n) => n - 1)
	};
}

export const index = createStore();

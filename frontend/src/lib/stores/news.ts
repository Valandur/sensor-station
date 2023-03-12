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

const stores: Map<string, ReturnType<typeof createStore>> = new Map();

export function getIndexStore(category: string, max: number) {
	let store = stores.get(category);
	if (!store) {
		store = createStore();
		store.setMax(max);
		stores.set(category, store);
	}
	return store;
}

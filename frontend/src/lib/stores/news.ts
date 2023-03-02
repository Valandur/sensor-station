import { writable } from 'svelte/store';

function createStore() {
	const { subscribe, update } = writable(0);

	return {
		subscribe,
		increment: () => update((n) => n + 1),
		decrement: () => update((n) => n - 1)
	};
}

const stores: Map<string, ReturnType<typeof createStore>> = new Map();

export function getIndexStore(category: string) {
	let store = stores.get(category);
	if (!store) {
		store = createStore();
		stores.set(category, store);
	}
	return store;
}

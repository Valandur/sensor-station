import { writable } from 'svelte/store';

function createStore() {
	const { subscribe, update } = writable(0);

	let max = 1;

	return {
		subscribe,
		setMax: (newMax: number) => {
			max = Math.max(1, newMax);
			update((value) => value % max);
		},
		increment: () => update((n) => (n + 1) % max),
		decrement: () => update((n) => (n <= 0 ? max : n) - 1)
	};
}

const stores: Map<string, ReturnType<typeof createStore>> = new Map();

export function getStore(name: string, max: number) {
	let store = stores.get(name);
	if (!store) {
		store = createStore();
		stores.set(name, store);
	}

	store.setMax(max);
	return store;
}

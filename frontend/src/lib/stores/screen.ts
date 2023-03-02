import { tweened } from 'svelte/motion';
import { writable } from 'svelte/store';

const { subscribe, update } = writable(0);
const pause = writable(true);

export const progress = tweened(0, { duration: 10000 });

let timer: NodeJS.Timeout | null = null;

const next = () => {
	update((value) => value + 1);
	reset();
};

const prev = () => {
	update((value) => value - 1);
	reset();
};

const start = () => {
	pause.set(false);
	timer = setTimeout(next, 10000);
	progress.set(100);
};

const stop = () => {
	if (timer) {
		clearTimeout(timer);
		timer = null;
	}
	progress.set(0, { duration: 0 });
	pause.set(true);
};

const reset = () => {
	stop();
	start();
};

start();

export const screen = {
	subscribe,
	reset,
	next,
	prev,
	start,
	stop
};

export const paused = {
	subscribe: pause.subscribe
};

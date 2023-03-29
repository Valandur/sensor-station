import { tweened } from 'svelte/motion';
import { writable } from 'svelte/store';

const UPDATE_INTERVAL = 20000;

const { subscribe, update } = writable(0);
const pause = writable(true);

export const progress = tweened(0, { duration: UPDATE_INTERVAL });

let timer: NodeJS.Timeout | null = null;
let max = 1;
let lastOp = 1;

const next = () => {
	lastOp = 1;
	update((value) => (value + 1) % max);
	reset();
};

const prev = () => {
	lastOp = -1;
	update((value) => (value <= 0 ? max : value) - 1);
	reset();
};

const skip = () => {
	if (lastOp > 0) {
		next();
	} else {
		prev();
	}
};

const start = () => {
	pause.set(false);
	timer = setTimeout(next, UPDATE_INTERVAL);
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
	setMax: (newMax: number) => (max = newMax),
	reset,
	next,
	prev,
	skip,
	start,
	stop
};

export const paused = {
	subscribe: pause.subscribe
};

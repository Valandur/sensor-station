import { dev } from '$app/environment';
import { tweened } from 'svelte/motion';
import { writable } from 'svelte/store';

export const paused = writable(dev);

let isPaused: boolean | null = null;

export function pause() {
	paused.update((val) => {
		isPaused = val;
		return true;
	});
}

export function resume() {
	if (isPaused !== null) {
		paused.set(isPaused);
		isPaused = null;
	}
}

export const progress = tweened(0);
let timer: number | null = null;
let timerMs: number = 0;
let timerCb: TimerHandler;

export function reset(resetProgress = true) {
	if (resetProgress) {
		progress.set(0, { duration: 0 });
	}
	if (timer) {
		clearTimeout(timer);
		timer = null;
	}
}

export function restart() {
	if (!timer) {
		return;
	}

	clearTimeout(timer);
	progress.set(100, { duration: timerMs });
	timer = setTimeout(timerCb, timerMs);
}

export function start(callback: TimerHandler, ms: number) {
	progress.set(100, { duration: ms });
	timer = setTimeout(callback, ms);
	timerMs = ms;
	timerCb = callback;
	paused.set(false);
}

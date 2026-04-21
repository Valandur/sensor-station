import { Tween } from 'svelte/motion';

let paused = $state(false);
let wasPaused = $state<boolean | null>(null);

export function isPaused() {
	return paused;
}

export function pause() {
	wasPaused = paused;
	paused = true;
}

export function resume() {
	if (wasPaused !== null) {
		paused = wasPaused;
		wasPaused = null;
	}
}

const progress = new Tween(0);
export function getProgress() {
	return progress.current;
}

let timer = $state<number | null>(null);
let timerMs = $state(0);
let timerCb = $state<TimerHandler>();

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

	if (timerCb) {
		clearTimeout(timer);
		progress.set(100, { duration: timerMs });
		timer = setTimeout(timerCb, timerMs);
	}
}

export function start(callback: TimerHandler, ms: number) {
	progress.set(100, { duration: ms });
	timer = setTimeout(callback, ms);
	timerMs = ms;
	timerCb = callback;
	wasPaused = false;
}

import { tweened } from 'svelte/motion';
import { writable } from 'svelte/store';

export const paused = writable(false);
export const progress = tweened(0);
let timer: NodeJS.Timeout | null = null;

export function reset() {
	if (timer) {
		progress.set(0, { duration: 0 });
		clearTimeout(timer);
		timer = null;
	}
}

export function start(callback: () => void, ms: number) {
	progress.set(100, { duration: ms });
	timer = setTimeout(callback, ms);
	paused.set(false);
}

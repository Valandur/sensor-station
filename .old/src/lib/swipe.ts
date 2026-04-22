import type { Action } from 'svelte/action';

export interface SwipeParameters {
	x?: number;
	y?: number;
}

export interface SwipeDetailsX {
	dir: 'left' | 'right';
	x: { start: number; diff: number };
}

export interface SwipeDetailsY {
	dir: 'up' | 'down';
	y: { start: number; diff: number };
}

export type SwipeDetails = SwipeDetailsX | SwipeDetailsY;

export type SwipeEvent = CustomEvent<SwipeDetails>;

export interface SwipeAttributes {
	'on:swipe': (event: SwipeEvent) => void;
}

export type SwipeAction = Action<HTMLElement, SwipeParameters, SwipeAttributes>;

const swipe: SwipeAction = (node: HTMLElement, params: SwipeParameters) => {
	let touching = false;
	let startX = 0;
	let startY = 0;

	const touchStart = (e: TouchEvent) => {
		touching = true;
		startX = e.changedTouches[0].clientX;
		startY = e.changedTouches[0].clientY;
	};

	const touchEnd = (e: TouchEvent) => {
		if (!touching) {
			return;
		}

		const diffX = e.changedTouches[0].clientX - startX;
		const diffY = e.changedTouches[0].clientY - startY;

		if (typeof params?.x === 'number') {
			if (diffX < -params.x) {
				node.dispatchEvent(
					new CustomEvent<SwipeDetails>('swipe', {
						detail: { dir: 'left', x: { start: startX, diff: diffX } }
					})
				);
			} else if (diffX > params.x) {
				node.dispatchEvent(
					new CustomEvent<SwipeDetails>('swipe', {
						detail: { dir: 'right', x: { start: startX, diff: diffX } }
					})
				);
			}
		}

		if (typeof params?.y === 'number') {
			if (diffY < -params.y) {
				node.dispatchEvent(
					new CustomEvent<SwipeDetails>('swipe', {
						detail: { dir: 'up', y: { start: startY, diff: diffY } }
					})
				);
			} else if (diffY > params.y) {
				node.dispatchEvent(
					new CustomEvent<SwipeDetails>('swipe', {
						detail: { dir: 'down', y: { start: startY, diff: diffY } }
					})
				);
			}
		}
	};

	const onScroll = () => {
		// Cancel swiping if we're scrolling
		touching = false;
	};

	node.addEventListener('touchstart', touchStart, false);
	node.addEventListener('touchend', touchEnd, false);
	node.addEventListener('scroll', onScroll, true);

	return {
		destroy() {
			node.removeEventListener('touchstart', touchStart, false);
			node.removeEventListener('touchend', touchEnd, false);
			node.removeEventListener('scroll', onScroll, true);
		}
	};
};

export { swipe };

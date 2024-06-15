type Result<T> = [T[], number, number, number];

export function clamp<T>(max: number, idx: number, amount: number, array: T[]): Result<T> {
	const index = clampIndex(max, idx, amount);
	const prev = clampIndex(max, idx - 1, amount);
	const next = clampIndex(max, idx + 1, amount);
	const arr = array.slice(index, index + amount);
	return [arr, prev, next, index];
}

export function clampIndex(max: number, idx: number, amount: number) {
	return Math.max(Math.min(idx, max - amount), 0);
}

export function wrap<T>(max: number, idx: number, amount: number, array: T[]): Result<T> {
	const index = wrapIndex(max, idx);
	const prev = wrapIndex(max, idx - 1);
	const next = wrapIndex(max, idx + 1);
	const arr = [
		...array.slice(idx, idx + amount),
		...array.slice(0, Math.max(amount - (max - idx), 0))
	];
	return [arr, prev, next, index];
}

export function wrapIndex(max: number, idx: number) {
	const index = idx % max;
	if (index >= 0) {
		return index;
	} else {
		return max + index;
	}
}

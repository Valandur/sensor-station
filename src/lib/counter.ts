export enum CounterType {
	Clamp = 'clamp',
	Wrap = 'wrap'
}

export interface CounterOptions {
	type?: CounterType;
	maxSliceSize?: number;
}

export class Counter {
	private _type: CounterType = CounterType.Clamp;
	public get type() {
		return this._type;
	}

	private _max = 1;
	public get max() {
		return this._max;
	}
	public set max(max: number) {
		this._max = Math.max(max, 1);
		this._value = this.fit(this._value);
	}

	private _value = 0;
	public get value() {
		return this._value;
	}

	private _maxSliceSize = 1;
	public get maxSliceSize() {
		return this._maxSliceSize;
	}

	public get sliceSize() {
		return Math.min(this._maxSliceSize, this._max);
	}

	public constructor(options?: CounterOptions) {
		if (options?.type) {
			this._type = options.type;
		}
		if (options?.maxSliceSize) {
			this._maxSliceSize = Math.max(options.maxSliceSize, 1);
		}
	}

	public next(): number {
		return this.fit(this._value + 1);
	}

	public increment(): number {
		const val = this._value;
		this._value = this.next();
		return val;
	}

	public previous(): number {
		return this.fit(this._value - 1);
	}

	public decrement(): number {
		const val = this._value;
		this._value = this.previous();
		return val;
	}

	public fit(value: number) {
		switch (this._type) {
			case CounterType.Clamp:
				return Math.max(Math.min(value, this._max - this.sliceSize), 0);

			case CounterType.Wrap:
				const idx = value % this._max;
				if (idx >= 0) {
					return idx;
				} else {
					return this._max + idx;
				}
		}
	}

	public slice<T>(array: T[], index?: number): T[] {
		const idx = typeof index === 'number' ? this.fit(index) : this._value;

		switch (this._type) {
			case CounterType.Clamp:
				return array.slice(idx, idx + this.sliceSize);

			case CounterType.Wrap:
				return [
					...array.slice(idx, idx + this.sliceSize),
					...array.slice(0, Math.max(this.sliceSize - (this._max - idx), 0))
				];
		}
	}
}

export function fit(type: CounterType, max: number, index: number, amount: number) {
	switch (type) {
		case CounterType.Clamp:
			return Math.max(Math.min(index, max - amount), 0);

		case CounterType.Wrap:
			const idx = index % max;
			if (idx >= 0) {
				return idx;
			} else {
				return max + idx;
			}
	}
}

export function slice<T>(
	type: CounterType,
	max: number,
	index: number,
	amount: number,
	array: T[]
): T[] {
	const idx = fit(type, max, index, amount);

	switch (type) {
		case CounterType.Clamp: {
			return array.slice(idx, idx + amount);
		}

		case CounterType.Wrap: {
			return [
				...array.slice(idx, idx + amount),
				...array.slice(0, Math.max(amount - (max - idx), 0))
			];
		}
	}
}

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

export class Counter {
	private _max = 0;
	private _value = 0;

	public get max() {
		return this._max;
	}
	public set max(max: number) {
		this._max = Math.max(max, 1);
		this._value = this.value % this._max;
	}

	public get value() {
		return this._value;
	}

	public constructor(max?: number, value?: number) {
		if (value) {
			this._value = value;
		}
		if (max) {
			// Use public accessor to also clamp value
			this.max = max;
		}
	}

	public next(): number {
		return (this._value + 1) % this._max;
	}

	public increment(): number {
		const val = this._value;
		this._value = this.next();
		return val;
	}

	public previous(): number {
		return (this._value <= 0 ? this._max : this._value) - 1;
	}

	public decrement(): number {
		const val = this._value;
		this._value = this.previous();
		return val;
	}

	public wrap(index: number) {
		const idx = index % this._max;
		if (idx >= 0) {
			return idx;
		} else {
			return this._max + idx;
		}
	}

	public sliceAndWrap<T>(array: T[], itemCount: number, index?: number): T[] {
		const idx = typeof index === 'number' ? this.wrap(index) : this._value;
		return [
			...array.slice(idx, idx + itemCount),
			...array.slice(0, Math.max(itemCount - (this._max - idx), 0))
		];
	}
}

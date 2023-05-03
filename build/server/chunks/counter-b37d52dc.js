class Counter {
  _max = 0;
  _value = 0;
  get max() {
    return this._max;
  }
  set max(max) {
    this._max = Math.max(max, 1);
    this._value = this.value % this._max;
  }
  get value() {
    return this._value;
  }
  constructor(max, value) {
    if (value) {
      this._value = value;
    }
    if (max) {
      this.max = max;
    }
  }
  next() {
    return (this._value + 1) % this._max;
  }
  increment() {
    const val = this._value;
    this._value = this.next();
    return val;
  }
  previous() {
    return (this._value <= 0 ? this._max : this._value) - 1;
  }
  decrement() {
    const val = this._value;
    this._value = this.previous();
    return val;
  }
  wrap(index) {
    const idx = index % this._max;
    if (idx >= 0) {
      return idx;
    } else {
      return this._max + idx;
    }
  }
  sliceAndWrap(array, itemCount, index) {
    const idx = typeof index === "number" ? this.wrap(index) : this._value;
    return [
      ...array.slice(idx, idx + itemCount),
      ...array.slice(0, Math.max(itemCount - (this._max - idx), 0))
    ];
  }
}

export { Counter as C };
//# sourceMappingURL=counter-b37d52dc.js.map

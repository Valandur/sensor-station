var CounterType = /* @__PURE__ */ ((CounterType2) => {
  CounterType2["Clamp"] = "clamp";
  CounterType2["Wrap"] = "wrap";
  return CounterType2;
})(CounterType || {});
class Counter {
  _type = "clamp";
  get type() {
    return this._type;
  }
  _max = 1;
  get max() {
    return this._max;
  }
  set max(max) {
    this._max = Math.max(max, 1);
    this._value = this.fit(this._value);
  }
  _value = 0;
  get value() {
    return this._value;
  }
  _maxSliceSize = 1;
  get maxSliceSize() {
    return this._maxSliceSize;
  }
  get sliceSize() {
    return Math.min(this._maxSliceSize, this._max);
  }
  constructor(options) {
    if (options?.type) {
      this._type = options.type;
    }
    if (options?.maxSliceSize) {
      this._maxSliceSize = Math.max(options.maxSliceSize, 1);
    }
  }
  next() {
    return this.fit(this._value + 1);
  }
  increment() {
    const val = this._value;
    this._value = this.next();
    return val;
  }
  previous() {
    return this.fit(this._value - 1);
  }
  decrement() {
    const val = this._value;
    this._value = this.previous();
    return val;
  }
  fit(value) {
    switch (this._type) {
      case "clamp":
        return Math.max(Math.min(value, this._max - this.sliceSize), 0);
      case "wrap":
        const idx = value % this._max;
        if (idx >= 0) {
          return idx;
        } else {
          return this._max + idx;
        }
    }
  }
  slice(array, index) {
    const idx = typeof index === "number" ? this.fit(index) : this._value;
    switch (this._type) {
      case "clamp":
        return array.slice(idx, idx + this.sliceSize);
      case "wrap":
        return [
          ...array.slice(idx, idx + this.sliceSize),
          ...array.slice(0, Math.max(this.sliceSize - (this._max - idx), 0))
        ];
    }
  }
}

export { Counter as C, CounterType as a };
//# sourceMappingURL=counter-Dt35QKyi.js.map

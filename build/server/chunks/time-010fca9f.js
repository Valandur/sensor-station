import { r as readable } from './index2-f56eb999.js';

const UPDATE_INTERVAL = 1e4;
const time = readable(/* @__PURE__ */ new Date(), (set) => {
  const interval = setInterval(() => {
    set(/* @__PURE__ */ new Date());
  }, UPDATE_INTERVAL);
  set(/* @__PURE__ */ new Date());
  return function stop() {
    clearInterval(interval);
  };
});

export { time as t };
//# sourceMappingURL=time-010fca9f.js.map

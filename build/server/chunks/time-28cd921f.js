import { r as readable } from './index2-f56eb999.js';

const UPDATE_INTERVAL = 1e3;
const time = readable(/* @__PURE__ */ new Date(), (set) => {
  const interval = setInterval(() => {
    set(/* @__PURE__ */ new Date());
  }, UPDATE_INTERVAL);
  return function stop() {
    clearInterval(interval);
  };
});

export { time as t };
//# sourceMappingURL=time-28cd921f.js.map

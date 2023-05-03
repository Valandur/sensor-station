import { r as readable } from './index2-117d0048.js';

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
//# sourceMappingURL=time-79998e79.js.map

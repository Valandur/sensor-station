import { r as readable } from './index2-9ac9acce.js';

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
//# sourceMappingURL=time-a7a3ef22.js.map

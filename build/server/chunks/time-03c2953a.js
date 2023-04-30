import { d as derived, r as readable } from './index2-584cecbe.js';
import { isSameDay } from 'date-fns';
import Holidays from 'date-holidays';

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
const holidays = new Holidays("CH", "ZH");
let lastHoliday = null;
let lastCheck = /* @__PURE__ */ new Date(0);
const holiday = derived(time, ($time) => {
  if (isSameDay(lastCheck, $time)) {
    return lastHoliday;
  }
  const holi = holidays.isHoliday($time);
  lastHoliday = holi ? holi[0] : null;
  lastCheck = $time;
  return lastHoliday;
});

export { holiday as h, time as t };
//# sourceMappingURL=time-03c2953a.js.map

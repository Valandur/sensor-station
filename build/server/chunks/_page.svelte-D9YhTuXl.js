import { c as create_ssr_component, a as subscribe, v as validate_component, e as escape } from './ssr-C0K3FAqp.js';
import { formatDistanceToNow } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { de } from 'date-fns/locale';
import { t as time } from './time-8zMHxtBA.js';
import { P as PageLayout } from './PageLayout-DsOGMQST.js';
import './index2-C3GUuYJX.js';
import './PageTitle-CPBz7j5U.js';

const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let cell;
  let $$unsubscribe_time;
  $$unsubscribe_time = subscribe(time, (value) => value);
  let { data } = $$props;
  let timeStr = "";
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  {
    timeStr = formatDistanceToNow(data.ts, { addSuffix: true, locale: de });
  }
  cell = data.cellular;
  $$unsubscribe_time();
  return `${validate_component(PageLayout, "PageLayout").$$render($$result, { title: "Modem", subTitle: timeStr }, {}, {
    default: () => {
      return `<div class="row"><div class="col"><table class="table table-sm"><colgroup data-svelte-h="svelte-hdc55i"><col> <col width="33%"> <col width="33%"> <col width="33%"></colgroup> <tbody><tr><td data-svelte-h="svelte-1svmcdn">Connected</td> <td colspan="2">${cell.operator !== null ? `<i class="icofont-check"></i>` : `<i class="icofont-close"></i>`}</td></tr> <tr><td data-svelte-h="svelte-1brx8we">Signal</td> <td colspan="3">${escape(cell.signal ? cell.signal.toFixed(0) + "%" : "---")}</td></tr> <tr><td data-svelte-h="svelte-jl1wxy">Operator</td> <td colspan="2">${escape(cell.operator)}</td> <td>${escape(cell.netType)}</td></tr> <tr><td data-svelte-h="svelte-4zeli3">Time</td> <td>${escape(cell.time && cell.tz ? formatInTimeZone(cell.time, cell.tz, "P", { locale: de }) : "---")}</td> <td>${escape(cell.time && cell.tz ? formatInTimeZone(cell.time, cell.tz, "p", { locale: de }) : "---")}</td> <td>${escape(cell.tz ?? "---")}</td></tr> <tr><td data-svelte-h="svelte-ycfpea">GPS</td> <td>${escape(data.gps?.lat.toFixed(8) ?? "---")}</td> <td>${escape(data.gps?.lng.toFixed(8) ?? "---")}</td> <td>${escape(data.gps?.tz ?? "---")}</td></tr> <tr><td data-svelte-h="svelte-16g1sc9">GEO</td> <td>${escape(data.geo?.lat.toFixed(8) ?? "---")}</td> <td>${escape(data.geo?.lng.toFixed(8) ?? "---")}</td> <td>${escape(data.geo?.tz ?? "---")}</td></tr></tbody></table></div></div>`;
    }
  })}`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-D9YhTuXl.js.map

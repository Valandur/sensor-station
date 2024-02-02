import { c as create_ssr_component, a as subscribe, v as validate_component, e as escape } from './ssr-z3nJZMSi.js';
import { formatDate, formatDistanceToNow, format } from 'date-fns';
import { de } from 'date-fns/locale';
import { t as time } from './time-Zz0IaY9S.js';
import { P as PageLayout } from './PageLayout-WEuMVC1N.js';
import './index2-_yOFBHcp.js';
import './PageTitle-RKNcnoyo.js';

const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let tzStr;
  let $time, $$unsubscribe_time;
  $$unsubscribe_time = subscribe(time, (value) => $time = value);
  let { data } = $$props;
  let timeStr = "";
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  data?.gpsTz || data?.timeTz || "Europe/Zurich";
  tzStr = formatDate($time, "O", { locale: de });
  {
    timeStr = formatDistanceToNow(data.ts, { addSuffix: true, locale: de });
  }
  $$unsubscribe_time();
  return `${validate_component(PageLayout, "PageLayout").$$render($$result, { title: "Modem", subTitle: timeStr }, {}, {
    default: () => {
      return `<div class="row"><div class="col"><table class="table table-sm"><colgroup data-svelte-h="svelte-1wj1qqe"><col> <col width="33%"> <col width="33%"></colgroup> <tbody><tr><td data-svelte-h="svelte-1svmcdn">Connected</td> <td colspan="2">${data.isConnected ? `<i class="icofont-check"></i>` : `<i class="icofont-close"></i>`}</td></tr> <tr><td data-svelte-h="svelte-1brx8we">Signal</td> <td colspan="2">${escape(data.signal)}/4</td></tr> <tr><td data-svelte-h="svelte-jl1wxy">Operator</td> <td colspan="2">${escape(data.operator)}</td></tr> <tr><td data-svelte-h="svelte-mvd9ad">Operator Time</td> <td>${escape(data.time ? format(data.time, "P - p", { locale: de }) : "---")}</td> <td>${escape(data.timeTz)}</td></tr> <tr><td data-svelte-h="svelte-1tyynsl">GPS Location</td> <td>${escape(data.lat)}</td> <td>${escape(data.lng)}</td></tr> <tr><td data-svelte-h="svelte-j6hsyp">GPS Timezone</td> <td>${escape(data.gpsTz)}</td> <td>${escape(tzStr)}</td></tr></tbody></table></div></div>`;
    }
  })}`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-9CGuGchQ.js.map

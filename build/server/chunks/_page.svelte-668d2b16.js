import { c as create_ssr_component, a as subscribe, v as validate_component, e as escape } from './index3-53157c6f.js';
import { formatDistanceToNow, format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import de from 'date-fns/locale/de/index.js';
import { t as time } from './time-9e4eace3.js';
import { P as PageLayout } from './PageLayout-443dc55c.js';
import './index2-047f7c26.js';
import './PageTitle-384e246f.js';

const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let timezone;
  let tzStr;
  let $time, $$unsubscribe_time;
  $$unsubscribe_time = subscribe(time, (value) => $time = value);
  let { data } = $$props;
  let timeStr = "";
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  timezone = data?.gpsTz || data?.timeTz || "Europe/Zurich";
  tzStr = formatInTimeZone($time, timezone, "O", { locale: de });
  {
    timeStr = formatDistanceToNow(data.ts, { addSuffix: true, locale: de });
  }
  $$unsubscribe_time();
  return `${validate_component(PageLayout, "PageLayout").$$render($$result, { title: "Modem", subTitle: timeStr }, {}, {
    default: () => {
      return `<div class="row"><div class="col"><table class="table table-sm"><colgroup><col>
					<col width="33%">
					<col width="33%"></colgroup>
				<tbody><tr><td>Connected</td>
						<td colspan="2">${data.isConnected ? `<i class="icofont-check"></i>` : `<i class="icofont-close"></i>`}</td></tr>
					<tr><td>Signal</td>
						<td colspan="2">${escape(data.signal)}/4</td></tr>
					<tr><td>Operator</td>
						<td colspan="2">${escape(data.operator)}</td></tr>
					<tr><td>Operator Time</td>
						<td>${escape(data.time ? format(data.time, "P - p", { locale: de }) : "---")}</td>
						<td>${escape(data.timeTz)}</td></tr>
					<tr><td>GPS Location</td>
						<td>${escape(data.lat)}</td>
						<td>${escape(data.lng)}</td></tr>
					<tr><td>GPS Timezone</td>
						<td>${escape(data.gpsTz)}</td>
						<td>${escape(tzStr)}</td></tr></tbody></table></div></div>`;
    }
  })}`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-668d2b16.js.map

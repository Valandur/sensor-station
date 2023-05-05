import { c as create_ssr_component, a as subscribe, v as validate_component, e as escape } from './index3-00641961.js';
import { formatDistanceToNow, format } from 'date-fns';
import de from 'date-fns/locale/de/index.js';
import { t as time } from './time-ae69e22a.js';
import { P as PageLayout } from './PageLayout-f14c8f49.js';
import './index2-9ac9acce.js';
import './PageTitle-cbb73582.js';

const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let status;
  let $$unsubscribe_time;
  $$unsubscribe_time = subscribe(time, (value) => value);
  let { data } = $$props;
  let timeStr = "";
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  status = data.status;
  {
    timeStr = formatDistanceToNow(status.ts, { addSuffix: true, locale: de });
  }
  $$unsubscribe_time();
  return `${validate_component(PageLayout, "PageLayout").$$render($$result, { title: "Modem", subTitle: timeStr }, {}, {
    default: () => {
      return `<div class="row"><div class="col"><table class="table table-sm"><colgroup><col>
					<col width="33%">
					<col width="33%"></colgroup>
				<tbody><tr><td>Connected</td>
						<td colspan="2">${status.isConnected ? `<i class="icofont-check"></i>` : `<i class="icofont-close"></i>`}</td></tr>
					<tr><td>Operator</td>
						<td colspan="2">${escape(status.operator)}</td></tr>
					<tr><td>Signal</td>
						<td colspan="2">${escape(status.signal)}/4</td></tr>
					<tr><td>Time</td>
						<td colspan="2">${escape(status.time ? format(status.time, "Pp z", { locale: de }) : "---")}</td></tr>
					<tr><td>Location</td>
						<td>${escape(status.lat)}</td>
						<td>${escape(status.lng)}</td></tr>
					<tr><td>Timezone</td>
						<td>${escape(status.tzName)}</td>
						<td>${escape(status.tzOffset)}</td></tr></tbody></table></div></div>`;
    }
  })}`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-99f90ef5.js.map

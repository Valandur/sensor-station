import { c as create_ssr_component, a as subscribe, v as validate_component, j as each, e as escape } from './index3-00641961.js';
import { formatDistanceToNow } from 'date-fns';
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
  return `${validate_component(PageLayout, "PageLayout").$$render($$result, { title: "Network", subTitle: timeStr }, {}, {
    default: () => {
      return `<div class="row overflow-auto"><div class="col"><table class="table table-sm"><thead><tr><th>Name</th>
						<th>Type</th>
						<th>Address</th>
						<th>MAC</th></tr></thead>
				<tbody>${each(status.interfaces, (iface) => {
        return `${each(iface.addresses, (address, i) => {
          return `<tr><td class="fw-bold">${escape(i === 0 ? iface.name : "")}</td>
								<td>${escape(address.family)}</td>
								<td>${escape(address.address)}</td>
								<td>${escape(address.mac)}</td>
							</tr>`;
        })}`;
      })}</tbody></table></div></div>`;
    }
  })}`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-fc314086.js.map

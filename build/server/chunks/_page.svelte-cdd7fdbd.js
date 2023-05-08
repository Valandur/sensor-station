import { c as create_ssr_component, a as subscribe, v as validate_component, d as each, e as escape } from './index3-53157c6f.js';
import { formatDistanceToNow } from 'date-fns';
import de from 'date-fns/locale/de/index.js';
import { t as time } from './time-9e4eace3.js';
import { P as PageLayout } from './PageLayout-443dc55c.js';
import './index2-047f7c26.js';
import './PageTitle-384e246f.js';

const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let interfaces;
  let $$unsubscribe_time;
  $$unsubscribe_time = subscribe(time, (value) => value);
  let { data } = $$props;
  let timeStr = "";
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  interfaces = data.interfaces;
  {
    timeStr = formatDistanceToNow(data.ts, { addSuffix: true, locale: de });
  }
  $$unsubscribe_time();
  return `${validate_component(PageLayout, "PageLayout").$$render($$result, { title: "Network", subTitle: timeStr }, {}, {
    default: () => {
      return `<div class="row overflow-auto"><div class="col"><table class="table table-sm"><thead><tr><th>Name</th>
						<th>Type</th>
						<th>Address</th>
						<th>MAC</th></tr></thead>
				<tbody>${each(interfaces, (iface) => {
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
//# sourceMappingURL=_page.svelte-cdd7fdbd.js.map

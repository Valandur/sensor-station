import { c as create_ssr_component, a as subscribe, v as validate_component, h as each, e as escape } from './ssr-C0K3FAqp.js';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';
import { t as time } from './time-8zMHxtBA.js';
import { P as PageLayout } from './PageLayout-DsOGMQST.js';
import './index2-C3GUuYJX.js';
import './PageTitle-CPBz7j5U.js';

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
      return `<div class="row overflow-auto"><div class="col"><table class="table table-sm"><thead data-svelte-h="svelte-u9rgwb"><tr><th>Name</th> <th>Type</th> <th>Address</th> <th>MAC</th></tr></thead> <tbody>${each(interfaces, (iface) => {
        return `${each(iface.addresses, (address, i) => {
          return `<tr><td class="fw-bold">${escape(i === 0 ? iface.name : "")}</td> <td>${escape(address.family)}</td> <td>${escape(address.address)}</td> <td>${escape(address.mac)}</td> </tr>`;
        })}`;
      })}</tbody></table></div></div>`;
    }
  })}`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-CTVjcL8R.js.map

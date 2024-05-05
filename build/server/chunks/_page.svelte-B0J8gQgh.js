import { c as create_ssr_component, v as validate_component, e as escape } from './ssr-C0K3FAqp.js';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import './client-CjdeEz1m.js';
import { E as EmptyCard } from './EmptyCard-CfonTR6E.js';
import { C as Card } from './Card-BVME-Fpr.js';
import './exports-DuWZopOC.js';

const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let alert;
  let summary;
  let description;
  let reason;
  let duration;
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  alert = data.alert;
  data.prevPage;
  data.nextPage;
  summary = alert.summary?.replace("Einschränkung", "").trim() || "";
  description = alert.description?.replace("Linien", "").trim() || "";
  reason = alert.reason?.replace("Grund:", "").trim() || "";
  duration = alert.duration?.replace("Dauer:", "").replaceAll(`${format(/* @__PURE__ */ new Date(), "dd.MM.yyyy", { locale: de })},`, "").trim() || "";
  return `<div class="h-100 d-flex flex-column justify-content-end">${alert ? `<div class="row"><div class="col">${validate_component(Card, "Card").$$render($$result, { type: "warning" }, {}, {
    subTitle: () => {
      return `${escape(description)} `;
    },
    title: () => {
      return `${escape(summary)} `;
    },
    header: () => {
      return `<div>${escape(reason)}</div> <div><i class="icofont-clock-time"></i> ${escape(duration)}</div> `;
    },
    default: () => {
      return `${escape(alert.consequence)}`;
    }
  })}</div></div>` : `${validate_component(EmptyCard, "EmptyCard").$$render($$result, {}, {}, {
    default: () => {
      return `Keine Einschränkungen im Betrieb der SBB`;
    }
  })}`}</div>`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-B0J8gQgh.js.map

import { c as create_ssr_component, e as escape, v as validate_component, h as each } from './ssr-C0K3FAqp.js';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import './client-CjdeEz1m.js';
import { E as EmptyCard } from './EmptyCard-CfonTR6E.js';
import { C as Card } from './Card-BVME-Fpr.js';
import './exports-DuWZopOC.js';

const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let loc;
  let alert;
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  loc = data.location;
  alert = data.alert;
  data.prevPage;
  data.nextPage;
  return `<div class="h-100 d-flex flex-column justify-content-end"><div class="row d-flex flex-row justify-content-end mb-2"><div class="col-auto text-muted"><i class="icofont-location-pin"></i> ${loc.place ? `${escape(loc.place.name)}, ${escape(loc.place.state)}, ${escape(loc.place.country)}` : `${escape(loc.lat)}, ${escape(loc.lng)}`}</div></div> ${alert ? `<div class="row mh-100 overflow-hidden"><div class="col mh-100">${validate_component(Card, "Card").$$render($$result, { type: "warning" }, {}, {
    subTitle: () => {
      return `${escape(alert.sender)} `;
    },
    title: () => {
      return `${escape(alert.event)} `;
    },
    header: () => {
      return `<div>${escape(alert.tags)}</div> <div><i class="icofont-calendar"></i> ${escape(format(alert.start, "dd.MM.yy HH:mm", { locale: de }))} -
							${escape(format(alert.end, "dd.MM.yy HH:mm", { locale: de }))}</div> `;
    },
    default: () => {
      return `<div class="overflow-scroll"><ul class="m-0 p-0 ms-3">${each(alert.content.split("\n"), (line) => {
        return `<li>${escape(line.substring(2))}</li>`;
      })}</ul></div>`;
    }
  })}</div></div>` : `${validate_component(EmptyCard, "EmptyCard").$$render($$result, {}, {}, {
    default: () => {
      return `Aktuell sind keine Wetter-Warnungen vorhanden`;
    }
  })}`}</div>`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-C8-CBteB.js.map

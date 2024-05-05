import { c as create_ssr_component, h as each, v as validate_component, e as escape } from './ssr-C0K3FAqp.js';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import './client-CjdeEz1m.js';
import { E as EmptyCard } from './EmptyCard-CfonTR6E.js';
import './exports-DuWZopOC.js';

const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let departures;
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  departures = data.departures;
  data.prevPage;
  data.nextPage;
  return `<div class="h-100 d-flex flex-column justify-content-end">${departures.length > 0 ? `${each(departures, (departure) => {
    return `<div class="row fs-2"><div class="col-3">${escape(format(departure.scheduled, "HH:mm", { locale: de }))} ${departure.delay > 0 ? `<span class="text-red">+${escape(departure.delay)}</span>` : ``}</div> <div class="col-2">${escape(departure.lineName)}</div> <div class="col-6">${escape(departure.destination)}</div> </div>`;
  })}` : `${validate_component(EmptyCard, "EmptyCard").$$render($$result, {}, {}, {
    default: () => {
      return `Es wurden keine Abfahrten gefunden`;
    }
  })}`}</div>`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-DY70cjLQ.js.map

import { c as create_ssr_component, e as escape, h as each, v as validate_component } from './ssr-CAc1Agzk.js';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import './client-CjdeEz1m.js';
import { E as EmptyCard } from './EmptyCard-C_z-10YU.js';
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
  return `<div class="h-100 d-flex flex-column justify-content-between"><div class="row d-flex flex-row justify-content-end"><div class="col-auto text-muted"><i class="icofont-location-pin"></i> ${loc.place ? `${escape(loc.place.name)}, ${escape(loc.place.state)}, ${escape(loc.place.country)}` : `${escape(loc.lat)}, ${escape(loc.lng)}`}</div></div> ${alert ? `<div class="row mh-100 overflow-hidden"><div class="col mh-100"><div class="card bg-warning border-warning bg-opacity-25 h-100"><div class="card-header border-warning fw-bold small d-flex justify-content-between"><div>${escape(alert.tags)}</div> <div><i class="icofont-calendar"></i> ${escape(format(alert.start, "dd.MM.yy HH:mm", { locale: de }))} -
							${escape(format(alert.end, "dd.MM.yy HH:mm", { locale: de }))}</div></div> <div class="card-body overflow-scroll"><h5 class="card-title">${escape(alert.event)}</h5> <h6 class="card-subtitle mb-2 text-white text-opacity-50">${escape(alert.sender)}</h6> <ul class="m-0 p-0 ms-3">${each(alert.content.split("\n"), (line) => {
    return `<li>${escape(line.substring(2))}</li>`;
  })}</ul></div> <div class="card-arrow" data-svelte-h="svelte-jbn5ww"><div class="card-arrow-top-left"></div> <div class="card-arrow-top-right"></div> <div class="card-arrow-bottom-left"></div> <div class="card-arrow-bottom-right"></div></div></div></div></div>` : `${validate_component(EmptyCard, "EmptyCard").$$render($$result, {}, {}, {
    default: () => {
      return `Aktuell sind keine Wetter-Warnungen vorhanden`;
    }
  })}`}</div>`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-BjMxvBpU.js.map

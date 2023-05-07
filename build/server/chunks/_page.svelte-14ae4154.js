import { c as create_ssr_component, e as escape, j as each, v as validate_component } from './index3-00641961.js';
import { format } from 'date-fns';
import de from 'date-fns/locale/de/index.js';
import { E as EmptyCard } from './EmptyCard-1fa6e2c1.js';

const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let lat;
  let lng;
  let alert;
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  lat = data.lat;
  lng = data.lng;
  alert = data.alert;
  data.prevPage;
  data.nextPage;
  return `<div class="h-100 d-flex flex-column justify-content-between"><div class="row d-flex flex-row justify-content-end"><div class="col-auto text-muted"><i class="icofont-location-pin"></i>
			${escape(lat)},
			${escape(lng)}</div></div>

	${alert ? `<div class="row mh-100"><div class="col mh-100"><div class="card bg-warning border-warning bg-opacity-25 h-100"><div class="card-header border-warning fw-bold small d-flex justify-content-between"><div>${escape(alert.sender)} - ${escape(alert.tags)}</div>
						<div><i class="icofont-calendar"></i>
							${escape(format(alert.start, "dd.MM.yy HH:mm", { locale: de }))} -
							${escape(format(alert.end, "dd.MM.yy HH:mm", { locale: de }))}</div></div>
					<div class="card-body overflow-scroll"><h5 class="card-title">${escape(alert.event)}</h5>
						<ul class="m-0 p-0 ms-3">${each(alert.content.split("\n"), (line) => {
    return `<li>${escape(line.substring(2))}</li>`;
  })}</ul></div>

					<div class="card-arrow"><div class="card-arrow-top-left"></div>
						<div class="card-arrow-top-right"></div>
						<div class="card-arrow-bottom-left"></div>
						<div class="card-arrow-bottom-right"></div></div></div></div></div>` : `${validate_component(EmptyCard, "EmptyCard").$$render($$result, {}, {}, {
    default: () => {
      return `Aktuell sind keine Wetter-Warnungen vorhanden`;
    }
  })}`}</div>`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-14ae4154.js.map

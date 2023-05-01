import { c as create_ssr_component, e as escape, j as each } from './index3-00641961.js';
import { format } from 'date-fns';
import de from 'date-fns/locale/de/index.js';

const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let alert;
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  alert = data.alert;
  return `<div class="container-fluid h-100 m-0 d-flex flex-column justify-content-end">${alert ? `<div class="row mh-100"><div class="col-1"></div>
			<div class="col-10 mh-100"><div class="card bg-warning border-warning bg-opacity-25 h-100"><div class="card-header border-warning fw-bold small d-flex justify-content-between"><div>${escape(alert.tags)}</div>
						<div><i class="icofont-calendar"></i>
							${escape(format(alert.start, "dd.MM.yy HH:mm", { locale: de }))} -
							${escape(format(alert.end, "dd.MM.yy HH:mm", { locale: de }))}</div></div>
					<div class="card-body overflow-scroll"><h5 class="card-title">${escape(alert.event)}</h5>
						<h6 class="card-subtitle mb-2 text-white text-opacity-50">${escape(alert.sender)}</h6>
						<ul class="m-0 p-0 ms-3">${each(alert.content.split("\n"), (line) => {
    return `<li>${escape(line.substring(2))}</li>`;
  })}</ul></div>

					<div class="card-arrow"><div class="card-arrow-top-left"></div>
						<div class="card-arrow-top-right"></div>
						<div class="card-arrow-bottom-left"></div>
						<div class="card-arrow-bottom-right"></div></div></div></div>
			<div class="col-1"></div></div>` : `<div class="row mb-5"><div class="col"></div>
			<div class="col-6"><div class="card bg-success border-success bg-opacity-25"><div class="card-body"><h5 class="card-title mb-0">Aktuell sind keine Wetter-Warnungen vorhanden</h5></div>

					<div class="card-arrow"><div class="card-arrow-top-left"></div>
						<div class="card-arrow-top-right"></div>
						<div class="card-arrow-bottom-left"></div>
						<div class="card-arrow-bottom-right"></div></div></div></div>
			<div class="col"></div></div>`}</div>`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-982e14b9.js.map

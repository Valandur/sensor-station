import { c as create_ssr_component, e as escape, b as add_styles, j as add_attribute, v as validate_component } from './ssr-4574e5c0.js';
import { add, formatDistanceToNow } from 'date-fns';
import de from 'date-fns/locale/de/index.js';
import { E as EmptyCard } from './EmptyCard-148676d8.js';

const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let job;
  let printer;
  let getETA;
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  job = data.info.job;
  printer = data.info.printer;
  getETA = () => {
    const eta = add(/* @__PURE__ */ new Date(), { seconds: job.time_remaining });
    return formatDistanceToNow(eta, { locale: de });
  };
  return `<div class="h-100 d-flex flex-column justify-content-end">${job.id ? `<div class="row"><div class="col"><div class="card bg-theme border-theme bg-opacity-25"><div class="card-header border-theme fw-bold small d-flex justify-content-between"><div>${escape(printer.state)} - #${escape(job.id)}</div> <div><i class="icofont-speed-meter"></i> ${escape(printer.speed)}%</div></div> <div class="card-body"><p class="display-6">Fertig in ${escape(getETA())}</p> <div class="progress mb-4"${add_styles({ "height": `100px` })}><div class="progress-bar display-6" role="progressbar"${add_attribute("aria-valuenow", job.progress, 0)} aria-valuemin="0" aria-valuemax="100"${add_styles({ "width": `${job.progress}%` })}>${escape(job.progress)}%</div></div> <table class="table table-sm"><colgroup><col${add_styles({ "width": `25%` })}> <col${add_styles({ "width": `25%` })}> <col${add_styles({ "width": `25%` })}> <col${add_styles({ "width": `25%` })}></colgroup> <tbody><tr><td data-svelte-h="svelte-5imlqa">Nozzle</td> <td class="fw-bold">${escape(printer.temp_nozzle)}°C</td> <td>${escape("->")}</td> <td>${escape(printer.target_nozzle)}°C</td></tr> <tr><td data-svelte-h="svelte-7t8a0n">Bed</td> <td class="fw-bold">${escape(printer.temp_bed)}°C</td> <td>${escape("->")}</td> <td>${escape(printer.target_bed)}°C</td></tr></tbody></table></div> <div class="card-arrow" data-svelte-h="svelte-jbn5ww"><div class="card-arrow-top-left"></div> <div class="card-arrow-top-right"></div> <div class="card-arrow-bottom-left"></div> <div class="card-arrow-bottom-right"></div></div></div></div></div>` : `${validate_component(EmptyCard, "EmptyCard").$$render($$result, {}, {}, {
    default: () => {
      return `Aktuell ist kein Druckauftrag in Bearbeitung`;
    }
  })}`}</div>`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-13e05d7e.js.map

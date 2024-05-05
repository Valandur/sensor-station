import { c as create_ssr_component, v as validate_component, e as escape, b as add_styles, j as add_attribute } from './ssr-C0K3FAqp.js';
import { add, formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';
import { E as EmptyCard } from './EmptyCard-CfonTR6E.js';
import { C as Card } from './Card-BVME-Fpr.js';

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
  return `<div class="h-100 d-flex flex-column justify-content-end">${job.id ? `<div class="row"><div class="col">${validate_component(Card, "Card").$$render($$result, {}, {}, {
    header: () => {
      return `<div>${escape(printer.state)} - #${escape(job.id)}</div> <div><i class="icofont-speed-meter"></i> ${escape(printer.speed)}%</div> `;
    },
    default: () => {
      return `<p class="display-6">Fertig in ${escape(getETA())}</p> <div class="progress mb-4"${add_styles({ "height": `4em` })}><div class="progress-bar display-6" role="progressbar"${add_attribute("aria-valuenow", job.progress, 0)} aria-valuemin="0" aria-valuemax="100"${add_styles({ "width": `${job.progress}%` })}>${escape(job.progress)}%</div></div> <table class="table table-sm"><colgroup><col${add_styles({ "width": `25%` })}> <col${add_styles({ "width": `25%` })}> <col${add_styles({ "width": `25%` })}> <col${add_styles({ "width": `25%` })}></colgroup> <tbody><tr><td data-svelte-h="svelte-5imlqa">Nozzle</td> <td class="fw-bold">${escape(printer.temp_nozzle)}°C</td> <td>${escape("->")}</td> <td>${escape(printer.target_nozzle)}°C</td></tr> <tr><td data-svelte-h="svelte-7t8a0n">Bed</td> <td class="fw-bold">${escape(printer.temp_bed)}°C</td> <td>${escape("->")}</td> <td>${escape(printer.target_bed)}°C</td></tr></tbody></table>`;
    }
  })}</div></div>` : `${validate_component(EmptyCard, "EmptyCard").$$render($$result, {}, {}, {
    default: () => {
      return `Aktuell ist kein Druckauftrag in Bearbeitung`;
    }
  })}`}</div>`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-CDvfvTuP.js.map

import { c as create_ssr_component, e as escape, v as validate_component } from './ssr-z3nJZMSi.js';
import { format, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';
import './client-_MkdHwD5.js';
import { E as EmptyCard } from './EmptyCard-_h4r_29v.js';
import './exports-mq_1S73-.js';

function formatDims({ x, y, z }) {
  return `${Math.round(x / 10)} x ${Math.round(y / 10)} x ${Math.round(z / 10)} cm`;
}
function formatWeight(weight) {
  return weight > 1e3 ? `${Math.round(weight / 100) / 10} kg` : `${weight} g`;
}
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let shipment;
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  shipment = data.shipment;
  data.prevPage;
  data.nextPage;
  return `<div class="h-100 d-flex flex-column justify-content-end">${shipment ? `<div class="row"><div class="col"><div class="card bg-theme border-theme bg-opacity-25"><div class="card-header border-theme fw-bold small d-flex justify-content-between"><div>${escape(shipment.number)}</div> ${shipment.arrival ? `<div><i class="icofont-calendar"></i> ${escape(format(parseISO(shipment.arrival), "dd.MM.yy", { locale: de }))}</div>` : ``}</div> <div class="card-body"><h5 class="card-title">${escape(shipment.sender ?? shipment.type)}</h5> <h6 class="card-subtitle mb-2 text-white text-opacity-50">${escape(shipment.sender ? shipment.type : "")}</h6> <p class="card-text">${shipment.dims ? `<i class="icofont-drag3"></i> ${escape(formatDims(shipment.dims))} <br>` : ``} ${shipment.weight ? `<i class="icofont-measure"></i> ${escape(formatWeight(shipment.weight))} <br>` : ``} ${shipment.status ? `<i class="icofont-bullhorn"></i> ${escape(shipment.status)}` : ``}</p></div> <div class="card-arrow" data-svelte-h="svelte-jbn5ww"><div class="card-arrow-top-left"></div> <div class="card-arrow-top-right"></div> <div class="card-arrow-bottom-left"></div> <div class="card-arrow-bottom-right"></div></div></div></div></div>` : `${validate_component(EmptyCard, "EmptyCard").$$render($$result, {}, {}, {
    default: () => {
      return `Keine Sendungen der Post unterwegs`;
    }
  })}`}</div>`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-fuicnFyi.js.map

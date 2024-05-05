import { c as create_ssr_component, v as validate_component, e as escape } from './ssr-C0K3FAqp.js';
import { format, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';
import './client-CjdeEz1m.js';
import { E as EmptyCard } from './EmptyCard-CfonTR6E.js';
import { C as Card } from './Card-BVME-Fpr.js';
import './exports-DuWZopOC.js';

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
  return `<div class="h-100 d-flex flex-column justify-content-end">${shipment ? `<div class="row"><div class="col">${validate_component(Card, "Card").$$render($$result, {}, {}, {
    subTitle: () => {
      return `${escape(shipment.sender ? shipment.type : "")} `;
    },
    title: () => {
      return `${escape(shipment.sender ?? shipment.type)} `;
    },
    header: () => {
      return `<div>${escape(shipment.number)}</div> ${shipment.arrival ? `<div><i class="icofont-calendar"></i> ${escape(format(parseISO(shipment.arrival), "dd.MM.yy", { locale: de }))}</div>` : ``} `;
    },
    default: () => {
      return `${shipment.dims ? `<i class="icofont-drag3"></i> ${escape(formatDims(shipment.dims))} <br>` : ``} ${shipment.weight ? `<i class="icofont-measure"></i> ${escape(formatWeight(shipment.weight))} <br>` : ``} ${shipment.status ? `<i class="icofont-bullhorn"></i> ${escape(shipment.status)}` : ``}`;
    }
  })}</div></div>` : `${validate_component(EmptyCard, "EmptyCard").$$render($$result, {}, {}, {
    default: () => {
      return `Keine Sendungen der Post unterwegs`;
    }
  })}`}</div>`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte--l3wCiLL.js.map

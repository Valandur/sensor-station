import { c as create_ssr_component, e as escape } from './index3-5519d9f6.js';
import { format } from 'date-fns';
import de from 'date-fns/locale/de/index.js';

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
  return `<div class="container-fluid h-100 m-0 d-flex flex-column justify-content-end">${shipment ? `<div class="row"><div class="col-2"></div>
			<div class="col-8"><div class="card bg-theme border-theme bg-opacity-25"><div class="card-header border-theme fw-bold small d-flex justify-content-between"><div>${escape(shipment.number)}</div>
						${shipment.arrival ? `<div><i class="icofont-calendar"></i>
								${escape(format(shipment.arrival, "dd.MM.yy", { locale: de }))}</div>` : ``}</div>
					<div class="card-body"><h5 class="card-title">${escape(shipment.sender)}</h5>
						<h6 class="card-subtitle mb-2 text-white text-opacity-50">${escape(shipment.type)}</h6>
						<p class="card-text">${shipment.dims ? `<i class="icofont-drag3"></i>
								${escape(formatDims(shipment.dims))}
								<br>` : ``}
							${shipment.weight ? `<i class="icofont-measure"></i>
								${escape(formatWeight(shipment.weight))}
								<br>` : ``}
							${shipment.status ? `<i class="icofont-bullhorn"></i>
								${escape(shipment.status)}` : ``}</p></div>

					<div class="card-arrow"><div class="card-arrow-top-left"></div>
						<div class="card-arrow-top-right"></div>
						<div class="card-arrow-bottom-left"></div>
						<div class="card-arrow-bottom-right"></div></div></div></div>
			<div class="col-2"></div></div>` : `<div class="row mb-5"><div class="col"></div>
			<div class="col-6"><div class="card bg-success border-success bg-opacity-25"><div class="card-body"><h5 class="card-title mb-0">Keine Sendungen der Post unterwegs</h5></div>

					<div class="card-arrow"><div class="card-arrow-top-left"></div>
						<div class="card-arrow-top-right"></div>
						<div class="card-arrow-bottom-left"></div>
						<div class="card-arrow-bottom-right"></div></div></div></div>
			<div class="col"></div></div>`}</div>`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-ab45e867.js.map

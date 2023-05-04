import { c as create_ssr_component, e as escape } from './index3-00641961.js';
import { format } from 'date-fns';
import de from 'date-fns/locale/de/index.js';

function formatTitle(title) {
  return title?.replace("Einschränkung", "").trim();
}
function formatDescription(lines) {
  return lines?.replace("Linien", "").trim();
}
function formatReason(reason) {
  return reason?.replace("Grund:", "").trim();
}
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let alert;
  let { data } = $$props;
  function formatDuration(duration) {
    return duration?.replace("Dauer:", "").replaceAll(`${format( new Date(), "dd.MM.yyyy", { locale: de })},`, "").trim();
  }
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  alert = data.alert;
  data.prevPage;
  data.nextPage;
  return `<div class="container-fluid h-100 m-0 d-flex flex-column justify-content-end">${alert ? `<div class="row"><div class="col-1"></div>
			<div class="col-10"><div class="card bg-warning border-warning bg-opacity-25"><div class="card-header border-warning fw-bold small d-flex justify-content-between"><div>${escape(formatDescription(alert.description))}</div>
						<div><i class="icofont-clock-time"></i>
							${escape(formatDuration(alert.duration))}</div></div>
					<div class="card-body"><h5 class="card-title">${escape(formatTitle(alert.summary))}</h5>
						<h6 class="card-subtitle mb-2 text-white text-opacity-50">${escape(formatReason(alert.reason))}</h6>
						<p class="card-text">${escape(alert.consequence)}</p></div>

					<div class="card-arrow"><div class="card-arrow-top-left"></div>
						<div class="card-arrow-top-right"></div>
						<div class="card-arrow-bottom-left"></div>
						<div class="card-arrow-bottom-right"></div></div></div></div>
			<div class="col-1"></div></div>` : `<div class="row mb-5"><div class="col"></div>
			<div class="col-6"><div class="card bg-success border-success bg-opacity-25"><div class="card-body"><h5 class="card-title mb-0">Keine Einschränkungen im ÖV in der Region Zürich</h5></div>

					<div class="card-arrow"><div class="card-arrow-top-left"></div>
						<div class="card-arrow-top-right"></div>
						<div class="card-arrow-bottom-left"></div>
						<div class="card-arrow-bottom-right"></div></div></div></div>
			<div class="col"></div></div>`}</div>`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-253f6faa.js.map

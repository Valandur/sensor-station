import { c as create_ssr_component, e as escape, v as validate_component } from './index3-53157c6f.js';
import { format } from 'date-fns';
import de from 'date-fns/locale/de/index.js';
import { E as EmptyCard } from './EmptyCard-53c877a3.js';

const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let alert;
  let summary;
  let description;
  let reason;
  let duration;
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  alert = data.alert;
  data.prevPage;
  data.nextPage;
  summary = alert.summary?.replace("Einschränkung", "").trim() || "";
  description = alert.description?.replace("Linien", "").trim() || "";
  reason = alert.reason?.replace("Grund:", "").trim() || "";
  duration = alert.duration?.replace("Dauer:", "").replaceAll(`${format( new Date(), "dd.MM.yyyy", { locale: de })},`, "").trim() || "";
  return `<div class="h-100 d-flex flex-column justify-content-end">${alert ? `<div class="row"><div class="col"><div class="card bg-warning border-warning bg-opacity-25">${reason || duration ? `<div class="card-header border-warning fw-bold small d-flex justify-content-between"><div>${escape(reason)}</div>
							<div><i class="icofont-clock-time"></i>
								${escape(duration)}</div></div>` : ``}
					<div class="card-body">${summary ? `<h5 class="card-title">${escape(summary)}</h5>` : ``}
						${description ? `<h6 class="card-subtitle mb-2 text-white text-opacity-50">${escape(description)}</h6>` : ``}
						${alert.consequence ? `<p class="card-text">${escape(alert.consequence)}</p>` : ``}</div>

					<div class="card-arrow"><div class="card-arrow-top-left"></div>
						<div class="card-arrow-top-right"></div>
						<div class="card-arrow-bottom-left"></div>
						<div class="card-arrow-bottom-right"></div></div></div></div></div>` : `${validate_component(EmptyCard, "EmptyCard").$$render($$result, {}, {}, {
    default: () => {
      return `Keine Einschränkungen im Betrieb der SBB`;
    }
  })}`}</div>`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-9967a835.js.map

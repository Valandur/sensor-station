import { c as create_ssr_component, a as subscribe, e as escape } from './index3-5519d9f6.js';
import { formatDistanceToNow, format } from 'date-fns';
import de from 'date-fns/locale/de/index.js';
import { t as time } from './time-28cd921f.js';
import './index2-f56eb999.js';

const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let status;
  let $$unsubscribe_time;
  $$unsubscribe_time = subscribe(time, (value) => value);
  let { data } = $$props;
  let timeStr = "";
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  status = data.status;
  {
    if (status?.ts) {
      timeStr = formatDistanceToNow(status.ts, { addSuffix: true, locale: de });
    }
  }
  $$unsubscribe_time();
  return `<div class="container-fluid m-0 p-1 vh-100 d-flex flex-column"><div class="row"><div class="col-auto"><h1>Modem</h1></div>
		<div class="col align-self-center text-secondary">${escape(timeStr ? `(${timeStr})` : "")}</div>
		<div class="col-auto"><button class="btn btn-sm btn-outline-theme"><i class="icofont-refresh"></i></button>
			<a class="btn btn-sm btn-outline-danger" href="/"><i class="icofont-ui-close"></i></a></div></div>

	<div class="row overflow-auto"><div class="col">${status ? `<table class="table table-sm"><colgroup><col>
						<col width="33%">
						<col width="33%"></colgroup>
					<tbody><tr><td>Connected</td>
							<td colspan="2">${status.isConnected ? `<i class="icofont-check"></i>` : `<i class="icofont-close"></i>`}</td></tr>
						<tr><td>Operator</td>
							<td colspan="2">${escape(status.operator)}</td></tr>
						<tr><td>Signal</td>
							<td colspan="2">${escape(status.signal)}/4</td></tr>
						<tr><td>Time</td>
							<td colspan="2">${escape(status.time ? format(status.time, "Pp z", { locale: de }) : "---")}</td></tr>
						<tr><td>Location</td>
							<td>${escape(status.lat)}</td>
							<td>${escape(status.lng)}</td></tr>
						<tr><td>Timezone</td>
							<td>${escape(status.tzName)}</td>
							<td>${escape(status.tzOffset)}</td></tr></tbody></table>` : `<div class="alert alert-danger m-2">No modem data!</div>`}</div></div></div>`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-c29f235e.js.map

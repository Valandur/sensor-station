import { c as create_ssr_component, a as subscribe, v as validate_component, e as escape } from './index3-00641961.js';
import { formatDistanceToNow } from 'date-fns';
import de from 'date-fns/locale/de/index.js';
import { t as time } from './time-ae69e22a.js';
import { P as PageLayout } from './PageLayout-f14c8f49.js';
import './index2-9ac9acce.js';
import './PageTitle-cbb73582.js';

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
    timeStr = formatDistanceToNow(status.ts, { addSuffix: true, locale: de });
  }
  $$unsubscribe_time();
  return `${validate_component(PageLayout, "PageLayout").$$render($$result, { title: "Battery", subTitle: timeStr }, {}, {
    default: () => {
      return `<div class="row overflow-auto"><div class="col"><table class="table table-sm"><colgroup><col>
					<col width="25%">
					<col width="25%">
					<col width="25%"></colgroup>
				<tbody><tr><td>Status</td>
						<td colspan="2">${escape(status.state)}</td>
						<td>${escape(status.charge)}%</td></tr>
					<tr><td>Power IN</td>
						<td>${escape(status.powerIn.state)}</td>
						<td>${escape(status.powerIn.voltage.toFixed(2))} V</td>
						<td>${escape(status.powerIn.current.toFixed(2))} A</td></tr>
					<tr><td>Power 5V IO</td>
						<td>${escape(status.powerIn5vIo.state)}</td>
						<td>${escape(status.powerIn5vIo.voltage.toFixed(2))} V</td>
						<td>${escape(status.powerIn5vIo.current.toFixed(2))} A</td></tr>
					<tr><td>Button</td>
						<td>${status.isButton ? `<i class="icofont-check"></i>` : `<i class="icofont-close"></i>`}</td>
						<td>Fault</td>
						<td>${status.isFault ? `<i class="icofont-check"></i>` : `<i class="icofont-close"></i>`}</td></tr>
					<tr><td>Profile Invalid</td>
						<td>${status.fault.batteryProfileInvalid ? `<i class="icofont-check"></i>` : `<i class="icofont-close"></i>`}</td>
						<td>Button Off</td>
						<td>${status.fault.buttonPowerOff ? `<i class="icofont-check"></i>` : `<i class="icofont-close"></i>`}</td></tr>
					<tr><td>Charging Temp.</td>
						<td>${escape(status.fault.chargingTemperatureFault)}</td>
						<td>Forced Off</td>
						<td>${status.fault.forcedPowerOff ? `<i class="icofont-check"></i>` : `<i class="icofont-close"></i>`}</td></tr>
					<tr><td>Sys Off</td>
						<td>${status.fault.forcedSysPowerOff ? `<i class="icofont-check"></i>` : `<i class="icofont-close"></i>`}</td>
						<td>Watchdog</td>
						<td>${status.fault.watchdogReset ? `<i class="icofont-check"></i>` : `<i class="icofont-close"></i>`}</td></tr></tbody></table></div></div>`;
    }
  })}`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-2e3020e2.js.map

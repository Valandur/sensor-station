import { c as create_ssr_component, a as subscribe, v as validate_component, e as escape } from './index3-53157c6f.js';
import { formatDistanceToNow } from 'date-fns';
import de from 'date-fns/locale/de/index.js';
import { t as time } from './time-9e4eace3.js';
import { P as PageLayout } from './PageLayout-443dc55c.js';
import './index2-047f7c26.js';
import './PageTitle-384e246f.js';

const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let fault;
  let powerIn;
  let powerIn5vIo;
  let $$unsubscribe_time;
  $$unsubscribe_time = subscribe(time, (value) => value);
  let { data } = $$props;
  let timeStr = "";
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  fault = data.fault;
  powerIn = data.powerIn;
  powerIn5vIo = data.powerIn5vIo;
  {
    timeStr = formatDistanceToNow(data.ts, { addSuffix: true, locale: de });
  }
  $$unsubscribe_time();
  return `${validate_component(PageLayout, "PageLayout").$$render($$result, { title: "Battery", subTitle: timeStr }, {}, {
    default: () => {
      return `<div class="row overflow-auto"><div class="col"><table class="table table-sm"><colgroup><col>
					<col width="25%">
					<col width="25%">
					<col width="25%"></colgroup>
				<tbody><tr><td>Status</td>
						<td colspan="2">${escape(data.state)}</td>
						<td>${escape(data.charge)}%</td></tr>
					<tr><td>Power IN</td>
						<td>${escape(powerIn.state)}</td>
						<td>${escape(powerIn.voltage.toFixed(2))} V</td>
						<td>${escape(powerIn.current.toFixed(2))} A</td></tr>
					<tr><td>Power 5V IO</td>
						<td>${escape(powerIn5vIo.state)}</td>
						<td>${escape(powerIn5vIo.voltage.toFixed(2))} V</td>
						<td>${escape(powerIn5vIo.current.toFixed(2))} A</td></tr>
					<tr><td>Button</td>
						<td>${data.isButton ? `<i class="icofont-check"></i>` : `<i class="icofont-close"></i>`}</td>
						<td>Fault</td>
						<td>${data.isFault ? `<i class="icofont-check"></i>` : `<i class="icofont-close"></i>`}</td></tr>
					<tr><td>Profile Invalid</td>
						<td>${fault.batteryProfileInvalid ? `<i class="icofont-check"></i>` : `<i class="icofont-close"></i>`}</td>
						<td>Button Off</td>
						<td>${fault.buttonPowerOff ? `<i class="icofont-check"></i>` : `<i class="icofont-close"></i>`}</td></tr>
					<tr><td>Charging Temp.</td>
						<td>${escape(fault.chargingTemperatureFault)}</td>
						<td>Forced Off</td>
						<td>${fault.forcedPowerOff ? `<i class="icofont-check"></i>` : `<i class="icofont-close"></i>`}</td></tr>
					<tr><td>Sys Off</td>
						<td>${fault.forcedSysPowerOff ? `<i class="icofont-check"></i>` : `<i class="icofont-close"></i>`}</td>
						<td>Watchdog</td>
						<td>${fault.watchdogReset ? `<i class="icofont-check"></i>` : `<i class="icofont-close"></i>`}</td></tr></tbody></table></div></div>`;
    }
  })}`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-381389c9.js.map

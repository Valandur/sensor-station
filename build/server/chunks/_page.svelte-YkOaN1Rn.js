import { c as create_ssr_component, a as subscribe, v as validate_component, e as escape } from './ssr-z3nJZMSi.js';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';
import { t as time } from './time-Zz0IaY9S.js';
import { P as PageLayout } from './PageLayout-WEuMVC1N.js';
import './index2-_yOFBHcp.js';
import './PageTitle-RKNcnoyo.js';

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
      return `<div class="row overflow-auto"><div class="col"><table class="table table-sm"><colgroup data-svelte-h="svelte-kzwtmd"><col> <col width="25%"> <col width="25%"> <col width="25%"></colgroup> <tbody><tr><td data-svelte-h="svelte-32owck">Status</td> <td colspan="2">${escape(data.state)}</td> <td>${escape(data.charge)}%</td></tr> <tr><td data-svelte-h="svelte-tdkx3q">Power IN</td> <td>${escape(powerIn.state)}</td> <td>${escape(powerIn.voltage.toFixed(2))} V</td> <td>${escape(powerIn.current.toFixed(2))} A</td></tr> <tr><td data-svelte-h="svelte-14gfq16">Power 5V IO</td> <td>${escape(powerIn5vIo.state)}</td> <td>${escape(powerIn5vIo.voltage.toFixed(2))} V</td> <td>${escape(powerIn5vIo.current.toFixed(2))} A</td></tr> <tr><td data-svelte-h="svelte-vrb0za">Button</td> <td>${data.isButton ? `<i class="icofont-check"></i>` : `<i class="icofont-close"></i>`}</td> <td data-svelte-h="svelte-14y4g7y">Fault</td> <td>${data.isFault ? `<i class="icofont-check"></i>` : `<i class="icofont-close"></i>`}</td></tr> <tr><td data-svelte-h="svelte-rxzfvg">Profile Invalid</td> <td>${fault.batteryProfileInvalid ? `<i class="icofont-check"></i>` : `<i class="icofont-close"></i>`}</td> <td data-svelte-h="svelte-te6igv">Button Off</td> <td>${fault.buttonPowerOff ? `<i class="icofont-check"></i>` : `<i class="icofont-close"></i>`}</td></tr> <tr><td data-svelte-h="svelte-1ce0pk9">Charging Temp.</td> <td>${escape(fault.chargingTemperatureFault)}</td> <td data-svelte-h="svelte-1jsl7va">Forced Off</td> <td>${fault.forcedPowerOff ? `<i class="icofont-check"></i>` : `<i class="icofont-close"></i>`}</td></tr> <tr><td data-svelte-h="svelte-11uk8ju">Sys Off</td> <td>${fault.forcedSysPowerOff ? `<i class="icofont-check"></i>` : `<i class="icofont-close"></i>`}</td> <td data-svelte-h="svelte-1xf948l">Watchdog</td> <td>${fault.watchdogReset ? `<i class="icofont-check"></i>` : `<i class="icofont-close"></i>`}</td></tr></tbody></table></div></div>`;
    }
  })}`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-YkOaN1Rn.js.map

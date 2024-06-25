import { c as create_ssr_component, v as validate_component, m as missing_component } from './ssr-BXLnvVnr.js';
import { S as SERVICES } from './services2-DiIYuW7t.js';
import './services-BJig70jM.js';
import 'path';
import 'fs/promises';
import './index2-ahRAPocb.js';
import 'date-fns';
import 'node:util';
import 'chalk';
import 'node:fs/promises';
import 'googleapis';
import 'node:fs';
import 'node:path';
import 'node:stream';
import 'node:stream/promises';
import 'node:crypto';
import 'get-video-dimensions';
import 'image-size';
import 'mime-types';
import 'date-holidays';
import 'geo-tz/now';
import '@googlemaps/google-maps-services-js';
import 'serialport';
import 'node:os';
import 'node:dns/promises';
import 'xml2js';
import 'node-html-parser';
import 'rss-parser';
import 'html-entities';
import 'fetch-cookie';
import 'tuyapi';
import './PageTitle-BMwv6NOy.js';
import './exports-DuWZopOC.js';
import 'date-fns-tz';
import 'date-fns/locale';
import 'date-fns/isSameDay';
import './index-BhqCiM8-.js';
import 'date-fns/format';
import 'date-fns/locale/de';
import 'date-fns/formatDistanceToNow';
import 'date-fns/add';
import 'date-fns/parseISO';

const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let name;
  let type;
  let action;
  let serviceData;
  let comp;
  let { data } = $$props;
  let { form } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  if ($$props.form === void 0 && $$bindings.form && form !== void 0)
    $$bindings.form(form);
  name = data.name;
  type = data.type;
  action = data.action;
  serviceData = data.data;
  comp = SERVICES[type];
  return `${validate_component(comp || missing_component, "svelte:component").$$render($$result, { name, action, data: serviceData, form }, {}, {})}`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-D897JE24.js.map

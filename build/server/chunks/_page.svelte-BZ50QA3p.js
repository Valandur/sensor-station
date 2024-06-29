import { c as create_ssr_component, v as validate_component, m as missing_component } from './ssr-DyNlIM9y.js';
import { S as SERVICES } from './services2-B2_mxGud.js';
import './services-CfxjuNbL.js';
import 'path';
import 'fs/promises';
import './index2-ahRAPocb.js';
import 'date-fns';
import 'node:util';
import 'chalk';
import 'node:fs/promises';
import 'googleapis';
import 'date-holidays';
import 'date-fns/isSameDay';
import 'node:fs';
import 'node:path';
import 'node:stream';
import 'node:stream/promises';
import 'node:crypto';
import 'get-video-dimensions';
import 'image-size';
import 'mime-types';
import 'geo-tz/now';
import '@googlemaps/google-maps-services-js';
import 'serialport';
import 'node:os';
import 'node:dns/promises';
import 'node:child_process';
import 'node-wifi';
import 'xml2js';
import 'node-html-parser';
import 'rss-parser';
import 'html-entities';
import 'fetch-cookie';
import 'date-fns/parseISO';
import 'tough-cookie';
import 'tuyapi';
import './PageTitle-ContvOSw.js';
import './exports-DuWZopOC.js';
import 'perfect-scrollbar';
import './index-CckTN70d.js';
import 'date-fns-tz';
import 'date-fns/locale';
import 'date-fns/format';
import 'date-fns/locale/de';
import 'date-fns/formatDistanceToNow';
import 'date-fns/add';

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
//# sourceMappingURL=_page.svelte-BZ50QA3p.js.map

import { c as create_ssr_component, v as validate_component, b as add_attribute, e as each, d as escape } from './ssr-DyNlIM9y.js';
import './PageTitle-DyuE1mLh.js';
import { P as PageLayout, S as SERVICES } from './services2-r1vki8YZ.js';
import './exports-DuWZopOC.js';
import './services-hvqOe3c-.js';
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
import 'xml2js';
import 'node-html-parser';
import 'rss-parser';
import 'html-entities';
import 'fetch-cookie';
import 'tuyapi';
import 'date-fns-tz';
import 'date-fns/locale';
import 'date-fns/isSameDay';
import './index-CckTN70d.js';
import 'date-fns/format';
import 'date-fns/locale/de';
import 'date-fns/formatDistanceToNow';
import 'date-fns/add';
import 'date-fns/parseISO';

const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let types;
  let services;
  let { data } = $$props;
  let newName = "";
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  types = data.types;
  services = data.services;
  return `${validate_component(PageLayout, "PageLayout").$$render($$result, { title: "Services" }, {}, {
    default: () => {
      return `<div class="row overflow-auto"><div class="col"><table class="table"><colgroup data-svelte-h="svelte-134cscc"><col width="50%"> <col width="50%"> <col></colgroup> <tbody><tr><td><input form="formNew" type="text" name="newName" placeholder="Name" class="form-control"${add_attribute("value", newName, 0)}></td> <td><select form="formNew" name="newType" class="form-select"><option value="" selected disabled data-svelte-h="svelte-1d2mk1m">---</option>${each(types, ({ name }) => {
        return `<option${add_attribute("value", name, 0)}>${escape(name)}</option>`;
      })}</select></td> <td><form id="formNew" method="POST" action="?/add"><button type="submit" class="btn btn-theme" ${"disabled"}><i class="icofont-ui-add"></i></button></form></td></tr> ${each(services, (service) => {
        return `<tr><td>${escape(service.name)}</td> <td>${escape(service.type.name)}</td> <td><form method="POST" action="?/delete"><input type="hidden" name="name"${add_attribute("value", service.name, 0)}> <div class="btn-group">${!!SERVICES[service.type.name] ? `${service.type.actions.includes("preview") ? `<a href="${"/services/" + escape(service.name, true) + "/preview"}" class="btn btn-primary"><i class="icofont-eye-alt"></i> </a>` : ``} ${service.type.actions.includes("config") ? `<a href="${"/services/" + escape(service.name, true) + "/config"}" class="btn btn-theme"><i class="icofont-gear"></i> </a>` : ``}` : ``} <button class="btn btn-danger" data-svelte-h="svelte-30oq2c"><i class="icofont-ui-delete"></i> </button></div> </form></td> </tr>`;
      })}</tbody></table></div></div>`;
    }
  })}`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-DflWZuRB.js.map

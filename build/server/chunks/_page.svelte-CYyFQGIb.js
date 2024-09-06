import { c as create_ssr_component, v as validate_component, b as add_attribute, e as each, d as escape } from './ssr-B6UWI-Ry.js';
import './PageTitle-CGi1dnBU.js';
import { P as PageLayout, S as SERVICES } from './services2-BuXM7kIt.js';
import './exports-BGi7-Rnc.js';
import './services-Do515yvF.js';
import 'path';
import 'fs/promises';
import './index2-DLxiolUj.js';
import 'date-fns/format';
import 'node:util';
import 'chalk';
import 'date-fns';
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
import 'perfect-scrollbar';
import './index-BxsKR37n.js';
import 'date-fns-tz';
import 'date-fns/locale';
import 'date-fns/locale/de';
import 'date-fns/formatDistanceToNow';
import 'date-fns/add';

const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let types;
  let services;
  let mainActions;
  let { data } = $$props;
  let mainName = data.main?.name ?? "";
  data.main?.action ?? "";
  let newName = "";
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  types = data.types;
  services = data.services;
  mainActions = services.find((s) => s.name === mainName)?.type.actions ?? [];
  return `${validate_component(PageLayout, "PageLayout").$$render($$result, { title: "Services" }, {}, {
    default: () => {
      return `<ul class="nav nav-tabs" data-svelte-h="svelte-7i8drn"><li class="nav-item me-1"><a href="#services" class="nav-link active" data-bs-toggle="tab">Services</a></li> <li class="nav-item me-1"><a href="#general" class="nav-link" data-bs-toggle="tab">General</a></li></ul> <div class="tab-content flex-1 pt-3"><div class="tab-pane container-fluid fade show active" id="services"><table class="table"><colgroup data-svelte-h="svelte-134cscc"><col width="50%"> <col width="50%"> <col></colgroup> <tbody><tr class="bg-dark"><td><input form="formNew" type="text" name="newName" placeholder="Name" class="form-control"${add_attribute("value", newName, 0)}></td> <td><select form="formNew" name="newType" class="form-select"><option value="" selected disabled data-svelte-h="svelte-1d2mk1m">---</option>${each(types, ({ name }) => {
        return `<option${add_attribute("value", name, 0)}>${escape(name)}</option>`;
      })}</select></td> <td><form id="formNew" method="POST" action="?/add"><button type="submit" class="btn btn-theme" ${"disabled"}><i class="fa-solid fa-plus"></i></button></form></td></tr> ${each(services, (service) => {
        return `<tr><td>${escape(service.name)}</td> <td>${escape(service.type.name)}</td> <td><form method="POST" action="?/delete"><input type="hidden" name="name"${add_attribute("value", service.name, 0)}> <div class="btn-group">${!!SERVICES[service.type.name] ? (() => {
          let actions = service.type.actions.filter((a) => a !== "config");
          return ` ${actions.length > 1 ? `<div class="dropdown"><button class="btn btn-primary" type="button" data-bs-toggle="dropdown" aria-expanded="false" data-svelte-h="svelte-1qq9vvz"><i class="fa-solid fa-eye"></i></button> <ul class="dropdown-menu">${each(actions, (action) => {
            return `<li><a class="dropdown-item" href="${"/services/" + escape(service.name, true) + "/" + escape(action, true)}">${escape(action)}</a> </li>`;
          })}</ul> </div>` : `${actions.length > 0 ? `<a href="${"/services/" + escape(service.name, true) + "/" + escape(actions[0], true)}" class="btn btn-primary"><i class="fa-solid fa-eye"></i> </a>` : ``}`} ${service.type.actions.includes("config") ? `<a href="${"/services/" + escape(service.name, true) + "/config"}" class="btn btn-theme"><i class="fa-solid fa-gear"></i> </a>` : ``}`;
        })() : ``} <button class="btn btn-danger" data-svelte-h="svelte-5h4z19"><i class="fa-solid fa-trash"></i> </button></div> </form></td> </tr>`;
      })}</tbody></table></div> <div class="tab-pane container-fluid fade" id="general"><form method="POST" action="?/save" class="row"><label for="selectMainService" class="col-auto col-form-label" data-svelte-h="svelte-26l45a">Main</label> <div class="col"><select id="selectMainService" name="mainService" class="form-select"><option value="" data-svelte-h="svelte-1p7vunq">--- None ---</option>${each(data.services, (srv) => {
        return `<option${add_attribute("value", srv.name, 0)}>${escape(srv.name)} [${escape(srv.type.name)}]</option>`;
      })}</select></div> <div class="col"><select name="mainAction" class="form-select"><option value="" selected disabled data-svelte-h="svelte-1d2mk1m">---</option>${each(mainActions, (action) => {
        return `<option${add_attribute("value", action, 0)}>${escape(action)}</option>`;
      })}</select></div> <div class="col-auto" data-svelte-h="svelte-1i937jk"><button type="submit" class="btn btn-theme">Save</button></div></form></div></div>`;
    }
  })}`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-CYyFQGIb.js.map

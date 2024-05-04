import { c as create_ssr_component, v as validate_component, h as each, j as add_attribute, e as escape } from './ssr-CAc1Agzk.js';
import './client-CjdeEz1m.js';
import { P as PageLayout } from './PageLayout-Bsyf7Ahk.js';
import './exports-DuWZopOC.js';
import './PageTitle-CeY8r8pe.js';

const SCREEN_NAMES = {
  uploads: "Bilder",
  calendar: "Kalender",
  news: "News",
  printer: "Drucker",
  post: "Post",
  sbb: "SBB",
  games: "Spiele",
  weather: "Wetter",
  tuya: "Tuya"
};
const SCREEN_PARAMS = {
  news: {
    "1646": "Allgemein",
    "718": "Sport",
    "454": "Kultur",
    "630": "Wissen"
  },
  weather: {
    daily: "Täglich",
    hourly: "Stündlich",
    alerts: "Warnungen"
  },
  sbb: {
    alerts: "Einschränkungen",
    departures: "Abfahrten"
  }
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let screens;
  const allScreens = Object.entries(SCREEN_NAMES).sort((a, b) => a[1].localeCompare(b[1]));
  let { data } = $$props;
  let newName = "";
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  screens = data.screens;
  return `${validate_component(PageLayout, "PageLayout").$$render($$result, { title: "Settings" }, {}, {
    default: () => {
      return `<div class="row overflow-auto"><div class="col"><table class="table table-sm"><colgroup data-svelte-h="svelte-23sk60"><col width="50%"> <col width="50%"> <col> <col> <col></colgroup> <tbody><tr><td><select form="formNew" name="newName" class="form-select form-select-sm">${each(allScreens, ([value, name]) => {
        return `<option${add_attribute("value", value, 0)}>${escape(name)}</option>`;
      })}</select></td> <td>${newName in SCREEN_PARAMS ? (() => {
        let params = Object.entries(SCREEN_PARAMS[newName]).sort((a, b) => a[1].localeCompare(b[1]));
        return ` <select form="formNew" name="newParams" class="form-select form-select-sm">${each(params, ([value, name]) => {
          return `<option${add_attribute("value", value, 0)}>${escape(name)}</option>`;
        })}</select>`;
      })() : `<input form="formNew" type="hidden" name="newParams" value="">`}</td> <td></td> <td></td> <td><form id="formNew" method="POST" action="?/add"><button type="submit" class="btn btn-sm btn-success" ${"disabled"}><i class="icofont-ui-add"></i></button></form></td></tr> ${each(screens, (screen, i) => {
        return `<tr><td>${escape(SCREEN_NAMES[screen.name] || screen.name)}</td> <td>${escape(SCREEN_PARAMS[screen.name]?.[screen.params] || screen.params)}</td> <td><form method="POST" action="?/move"><input type="hidden" name="index"${add_attribute("value", i, 0)}> <input type="hidden" name="dir" value="up"> <button class="${[
          "btn btn-sm",
          (i > 0 ? "btn-outline-theme" : "") + " " + (i === 0 ? "btn-outline-secondary" : "")
        ].join(" ").trim()}" ${i === 0 ? "disabled" : ""} data-svelte-h="svelte-gbp3d4"><i class="icofont-caret-up"></i></button> </form></td> <td><form method="POST" action="?/move"><input type="hidden" name="index"${add_attribute("value", i, 0)}> <input type="hidden" name="dir" value="down"> <button class="${[
          "btn btn-sm",
          (i < screens.length - 1 ? "btn-outline-theme" : "") + " " + (i === screens.length - 1 ? "btn-outline-secondary" : "")
        ].join(" ").trim()}" ${i === screens.length - 1 ? "disabled" : ""}><i class="icofont-caret-down"></i></button> </form></td> <td><form method="POST" action="?/delete" data-svelte-h="svelte-5s1nga"><input type="hidden" name="index"${add_attribute("value", i, 0)}> <button class="btn btn-sm btn-danger"><i class="icofont-ui-delete"></i></button> </form></td> </tr>`;
      })}</tbody></table></div></div>`;
    }
  })}`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-C-Obii8N.js.map

import { c as create_ssr_component, j as each, k as add_attribute, e as escape } from './index3-8ba04f94.js';
import './utils-ae3035df.js';

const SCREEN_NAMES = {
  uploads: "Bilder",
  calendar: "Kalender",
  news: "News",
  post: "Post",
  sbb: "SBB",
  games: "Spiele",
  weather: "Wetter"
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
  }
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let screens;
  let { data } = $$props;
  let newName = "";
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  screens = data.screens;
  return `<div class="container-fluid m-0 p-1 vh-100 d-flex flex-column"><div class="row"><div class="col"><h1>Settings</h1></div>
		<div class="col-auto"><a class="btn btn-sm btn-outline-danger" href="/"><i class="icofont-ui-close"></i></a></div></div>

	<div class="row overflow-auto"><div class="col"><table class="table table-sm"><colgroup><col width="50%">
					<col width="50%">
					<col>
					<col>
					<col></colgroup>

				<tbody><tr><td><select form="formNew" name="newName" class="form-select form-select-sm">${each(Object.entries(SCREEN_NAMES), ([value, name]) => {
    return `<option${add_attribute("value", value, 0)}>${escape(name)}</option>`;
  })}</select></td>
						<td>${newName in SCREEN_PARAMS ? `<select form="formNew" name="newParams" class="form-select form-select-sm">${each(Object.entries(SCREEN_PARAMS[newName]), ([value, name]) => {
    return `<option${add_attribute("value", value, 0)}>${escape(name)}</option>`;
  })}</select>` : `<input form="formNew" type="hidden" name="newParams" value="">`}</td>
						<td></td>
						<td></td>
						<td><form id="formNew" method="POST" action="?/add"><button type="submit" class="btn btn-sm btn-outline-success" ${"disabled"}><i class="icofont-ui-add"></i></button></form></td></tr>

					${each(screens, (screen, i) => {
    return `<tr><td>${escape(SCREEN_NAMES[screen.name] || screen.name)}</td>
							<td>${escape(SCREEN_PARAMS[screen.name]?.[screen.params] || screen.params)}</td>
							<td><form method="POST" action="?/move"><input type="hidden" name="index"${add_attribute("value", i, 0)}>
									<input type="hidden" name="dir" value="up">
									<button class="${[
      "btn btn-sm",
      (i > 0 ? "btn-outline-theme" : "") + " " + (i === 0 ? "btn-outline-secondary" : "")
    ].join(" ").trim()}" ${i === 0 ? "disabled" : ""}><i class="icofont-caret-up"></i></button>
								</form></td>
							<td><form method="POST" action="?/move"><input type="hidden" name="index"${add_attribute("value", i, 0)}>
									<input type="hidden" name="dir" value="down">
									<button class="${[
      "btn btn-sm",
      (i < screens.length - 1 ? "btn-outline-theme" : "") + " " + (i === screens.length - 1 ? "btn-outline-secondary" : "")
    ].join(" ").trim()}" ${i === screens.length - 1 ? "disabled" : ""}><i class="icofont-caret-down"></i></button>
								</form></td>
							<td><form method="POST" action="?/delete"><input type="hidden" name="index"${add_attribute("value", i, 0)}>
									<button class="btn btn-sm btn-outline-danger"><i class="icofont-ui-delete"></i></button>
								</form></td>
						</tr>`;
  })}</tbody></table></div></div></div>`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-f5526009.js.map

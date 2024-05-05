import { c as create_ssr_component, b as add_styles, j as add_attribute, h as each } from './ssr-C0K3FAqp.js';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import './client-CjdeEz1m.js';
import './exports-DuWZopOC.js';

const css = {
  code: "img.svelte-1h3r0r0,video.svelte-1h3r0r0{max-width:100px;max-height:100px}input.svelte-1h3r0r0{color-scheme:dark}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let uploads;
  let { data } = $$props;
  let newTitle = "";
  let newDate = /* @__PURE__ */ new Date();
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css);
  uploads = data.uploads;
  return `<div class="container-fluid m-0 p-1 h-100 d-flex flex-column"><div class="row" data-svelte-h="svelte-j2dxqs"><div class="col"><h1>Uploads</h1></div></div> <div class="row overflow-auto"><table class="table table-sm"><colgroup data-svelte-h="svelte-1fmakgm"><col width="10%"> <col width="15%"> <col width="75%"> <col></colgroup> <tbody><tr><td>${`<button class="btn btn-sm" data-svelte-h="svelte-1buf0z4"><i class="icofont-image icofont-2x"></i></button>`} <input type="file" name="newImage" form="formNew" accept=".jpg, .jpeg, .png .mp4" class="svelte-1h3r0r0"${add_styles({ "display": `none` })}></td> <td><input type="date" form="formNew" name="newDate" class="form-control form-control-sm svelte-1h3r0r0"${add_attribute("value", newDate, 0)}></td> <td><input type="text" form="formNew" name="newTitle" class="form-control form-control-sm svelte-1h3r0r0"${add_attribute("value", newTitle, 0)}></td> <td><form id="formNew" method="POST" action="?/add"><button class="${[
    "btn btn-sm",
    " btn-outline-secondary"
  ].join(" ").trim()}" ${"disabled"}><i class="icofont-ui-add"></i></button></form></td></tr> ${each(uploads, (upload, i) => {
    return `<tr><td class="m-0 p-1">${upload.img.endsWith(".mp4") ? `<video${add_attribute("src", "/data/uploads/" + upload.img, 0)} muted class="svelte-1h3r0r0"></video>` : `<img${add_attribute("src", "/data/uploads/" + upload.img, 0)} alt="Upload" class="svelte-1h3r0r0">`}</td> <td class="m-0 p-1"><input type="date"${add_attribute("form", `formSave${i}`, 0)} name="date" class="form-control form-control-sm svelte-1h3r0r0"${add_attribute("value", format(upload.ts, "yyyy-MM-dd", { locale: de }), 0)}></td> <td class="m-0 p-1"><input type="text"${add_attribute("form", `formSave${i}`, 0)} name="title" class="form-control form-control-sm svelte-1h3r0r0"${add_attribute("value", upload.title, 0)}></td> <td><div class="btn-group"><form${add_attribute("id", `formSave${i}`, 0)} method="POST" action="?/save" data-svelte-h="svelte-t4qz6j"><input type="hidden" name="index"${add_attribute("value", i, 0)} class="svelte-1h3r0r0"> <button class="btn btn-sm btn-outline-success"><i class="icofont-save"></i> </button></form> <form method="POST" action="?/move"><input type="hidden" name="index"${add_attribute("value", i, 0)} class="svelte-1h3r0r0"> <input type="hidden" name="dir" value="up" class="svelte-1h3r0r0"> <button class="${[
      "btn btn-sm",
      (i > 0 ? "btn-outline-theme" : "") + " " + (i === 0 ? "btn-outline-secondary" : "")
    ].join(" ").trim()}" ${i === 0 ? "disabled" : ""} data-svelte-h="svelte-gbp3d4"><i class="icofont-caret-up"></i> </button></form> <form method="POST" action="?/move"><input type="hidden" name="index"${add_attribute("value", i, 0)} class="svelte-1h3r0r0"> <input type="hidden" name="dir" value="down" class="svelte-1h3r0r0"> <button class="${[
      "btn btn-sm",
      (i < uploads.length - 1 ? "btn-outline-theme" : "") + " " + (i === uploads.length - 1 ? "btn-outline-secondary" : "")
    ].join(" ").trim()}" ${i === uploads.length - 1 ? "disabled" : ""}><i class="icofont-caret-down"></i> </button></form> <form method="POST" action="?/delete" data-svelte-h="svelte-ju2ogj"><input type="hidden" name="index"${add_attribute("value", i, 0)} class="svelte-1h3r0r0"> <button class="btn btn-sm btn-outline-danger"><i class="icofont-ui-delete"></i> </button></form> </div></td> </tr>`;
  })}</tbody></table></div> </div>`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-DV5XbZeJ.js.map

import { c as create_ssr_component, j as add_attribute, h as each, e as escape, v as validate_component } from './ssr-CAc1Agzk.js';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import './client-CjdeEz1m.js';
import { E as EmptyCard } from './EmptyCard-C_z-10YU.js';
import './exports-DuWZopOC.js';

const css = {
  code: ".image-container.svelte-1mzno86.svelte-1mzno86{max-width:55%}.image-container.svelte-1mzno86 img.svelte-1mzno86,.image-container.svelte-1mzno86 video.svelte-1mzno86{max-height:100%;max-width:100%}.image-container.full.svelte-1mzno86.svelte-1mzno86{position:fixed;top:0;right:0;bottom:0;background-image:linear-gradient(to left, rgba(var(--bs-dark-rgb), 1) 60%, transparent)}.image-container.full.svelte-1mzno86>img.svelte-1mzno86,.image-container.full.svelte-1mzno86 video.svelte-1mzno86{position:absolute;right:0}.description.svelte-1mzno86.svelte-1mzno86{max-width:45%}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let upload;
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css);
  upload = data.upload;
  data.prevPage;
  data.nextPage;
  return `<div class="h-100 d-flex flex-column justify-content-end">${upload ? `<div class="${["row align-items-end", upload.ratio < 1 ? "h-100" : ""].join(" ").trim()}"><div class="${[
    "col mh-100 image-container svelte-1mzno86",
    (upload.ratio < 1 ? "full" : "") + " " + (upload.ratio < 1 ? "m-1" : "")
  ].join(" ").trim()}">${upload.img.endsWith(".mp4") ? `<video${add_attribute("src", "/data/uploads/" + upload.img, 0)} autoplay muted loop class="svelte-1mzno86"></video>` : `<img${add_attribute("src", "/data/uploads/" + upload.img, 0)} alt="Upload" class="svelte-1mzno86">`}</div> <div class="${[
    "col mh-100 align-self-stretch d-flex flex-column justify-content-between description svelte-1mzno86",
    (upload.ratio >= 1 ? "ps-2" : "") + " " + (upload.ratio >= 1 ? "text-end" : "")
  ].join(" ").trim()}"><div class="row"><div class="col">${each(upload.title.split("\n"), (line) => {
    return `${escape(line)} <br>`;
  })}</div></div> <div class="row"><div class="rol">${escape(format(upload.ts, "dd. MMM yyyy", { locale: de }))}</div></div></div></div>` : `${validate_component(EmptyCard, "EmptyCard").$$render($$result, {}, {}, {
    default: () => {
      return `Es wurden noch keine Bilder hochgeladen`;
    }
  })}`} </div>`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-BCMqqcWp.js.map

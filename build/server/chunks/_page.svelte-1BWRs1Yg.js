import { c as create_ssr_component, a as subscribe, h as each, v as validate_component, j as add_attribute, e as escape } from './ssr-CAc1Agzk.js';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';
import './client-CjdeEz1m.js';
import { p as paused } from './screen-Mimh1HLD.js';
import { E as EmptyCard } from './EmptyCard-C_z-10YU.js';
import './exports-DuWZopOC.js';
import './prod-ssr-B2gHlHjM.js';
import './index2-BCSlr_Kj.js';

const css = {
  code: ".abstract.svelte-1ja6365.svelte-1ja6365{font-size:1.4em;line-height:1em}iframe.svelte-1ja6365.svelte-1ja6365{width:100%;height:100%;border:1px solid gray}.details.svelte-1ja6365.svelte-1ja6365{position:fixed;top:0;left:0;right:0;bottom:0;padding:8px;background-color:rgba(var(--bs-white-rgb), 0.2);z-index:1000}.details.svelte-1ja6365 .btn.svelte-1ja6365{position:absolute;top:16px;right:16px}.image.svelte-1ja6365.svelte-1ja6365{position:relative;overflow:hidden}.image.svelte-1ja6365 img.svelte-1ja6365{position:absolute;max-width:100%}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let items;
  let $$unsubscribe_paused;
  $$unsubscribe_paused = subscribe(paused, (value) => value);
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css);
  data.feedId;
  items = data.items;
  data.prevPage;
  data.nextPage;
  $$unsubscribe_paused();
  return `<div class="h-100 d-flex flex-column">${``} ${items.length > 0 ? `${each(items, (item) => {
    return `<div role="presentation" class="row mt-1 flex-1"><div class="col-3 me-1 image svelte-1ja6365"><img alt="Thumbnail"${add_attribute("src", `/data/news/${item.image}`, 0)} class="svelte-1ja6365"></div> <div class="col abstract d-flex flex-column justify-content-around svelte-1ja6365"><div class="fs-4">${escape(item.title)}</div> <div class="fs-6 text-muted">${escape(formatDistanceToNow(item.ts, { locale: de, addSuffix: true }))} </div></div> </div>`;
  })}` : `${validate_component(EmptyCard, "EmptyCard").$$render($$result, {}, {}, {
    default: () => {
      return `Es wurden keine Newseinträge gefunden`;
    }
  })}`} </div>`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-1BWRs1Yg.js.map

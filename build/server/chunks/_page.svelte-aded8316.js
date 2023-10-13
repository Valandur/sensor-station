import { c as create_ssr_component, a as subscribe, d as each, j as add_attribute, e as escape } from './ssr-966767de.js';
import { formatDistanceToNow } from 'date-fns';
import de from 'date-fns/locale/de/index.js';
import { p as paused } from './screen-1e917d39.js';
import './prod-ssr-17392843.js';
import './index2-190a6a7d.js';

const css = {
  code: ".abstract.svelte-ntqhrj.svelte-ntqhrj{font-size:1.4rem;line-height:1.4rem}iframe.svelte-ntqhrj.svelte-ntqhrj{width:100%;height:100%;border:1px solid gray}.details.svelte-ntqhrj.svelte-ntqhrj{position:fixed;top:0;left:0;right:0;bottom:0;padding:8px;background-color:rgba(var(--bs-white-rgb), 0.2);z-index:1000}.details.svelte-ntqhrj .btn.svelte-ntqhrj{position:absolute;top:16px;right:16px}.image.svelte-ntqhrj.svelte-ntqhrj{position:relative;overflow:hidden}.image.svelte-ntqhrj img.svelte-ntqhrj{position:absolute;max-width:100%}",
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
  return `<div class="h-100 d-flex flex-column">${``} ${each(items, (item) => {
    return `<div role="presentation" class="row mt-1 flex-1"><div class="col-3 me-1 image svelte-ntqhrj"><img alt="Thumbnail"${add_attribute("src", `/data/news/${item.image}`, 0)} class="svelte-ntqhrj"></div> <div class="col abstract d-flex flex-column justify-content-around svelte-ntqhrj"><div class="fs-4">${escape(item.title)}</div> <div class="fs-6 text-muted">${escape(formatDistanceToNow(item.ts, { locale: de, addSuffix: true }))} </div></div> </div>`;
  })} </div>`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-aded8316.js.map

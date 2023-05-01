import { c as create_ssr_component, a as subscribe, j as each, k as add_attribute, e as escape } from './index3-00641961.js';
import { p as paused } from './screen-34baf483.js';
import './index2-9ac9acce.js';

const css = {
  code: ".abstract.svelte-xfcumr{font-size:1.4rem;line-height:1.4rem}iframe.svelte-xfcumr{width:100%;height:100%;border:1px solid gray}.details.svelte-xfcumr{position:fixed;top:0;left:0;right:0;bottom:0;padding:8px;background-color:rgba(var(--bs-white-rgb), 0.2);z-index:1000}.image.svelte-xfcumr{position:relative;overflow:hidden}img.svelte-xfcumr{position:absolute;max-width:100%}.btn.svelte-xfcumr{position:absolute;top:16px;left:16px}",
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
  items = data.items;
  $$unsubscribe_paused();
  return `<div class="container-fluid h-100 m-0 d-flex flex-column">${``}

	${each(items, (item) => {
    return `<div class="row mb-1 flex-1"><div class="col-3 me-1 image svelte-xfcumr"><img alt="Thumbnail"${add_attribute("src", item.img, 0)} class="svelte-xfcumr"></div>
			<div class="col p-1 abstract svelte-xfcumr">${escape(item.title)}</div>
		</div>`;
  })}
</div>`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-7b100fb5.js.map

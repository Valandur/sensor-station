import { c as create_ssr_component } from './ssr-B6UWI-Ry.js';

const css = {
  code: "html,body{font-size:32px}.dev-note.svelte-9f7dlo{position:fixed;top:4px;left:50%;padding:2px 8px;font-weight:600;color:var(--bs-black);background-color:rgba(var(--bs-warning-rgb), 0.6);border:4px solid var(--bs-black)}.toolbar.svelte-9f7dlo{position:fixed;top:0;left:calc(0.5 * var(--bs-gutter-x));right:calc(0.5 * var(--bs-gutter-x));overflow:hidden;display:flex;flex-direction:row;z-index:100}.overlay.svelte-9f7dlo{position:fixed;top:0;right:0;bottom:0;left:0;background-color:rgba(var(--bs-white-rgb), 0.2);z-index:10}",
  map: null
};
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return ` <div id="content" class="app-content p-1 d-flex flex-column">${slots.default ? slots.default({}) : ``}</div> ${``} ${``}`;
});

export { Layout as default };
//# sourceMappingURL=_layout.svelte-CaRUX-fG.js.map

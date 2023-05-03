import { c as create_ssr_component } from './index3-8ba04f94.js';

const css = {
  code: "html,body{font-size:30px;overflow:hidden;overscroll-behavior:none}",
  map: null
};
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `${slots.default ? slots.default({}) : ``}`;
});

export { Layout as default };
//# sourceMappingURL=_layout.svelte-a9cae5ba.js.map

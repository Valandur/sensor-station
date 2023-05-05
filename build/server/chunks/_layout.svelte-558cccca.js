import { c as create_ssr_component } from './index3-5519d9f6.js';

const css = {
  code: "html,body{font-size:30px}",
  map: null
};
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `${slots.default ? slots.default({}) : ``}`;
});

export { Layout as default };
//# sourceMappingURL=_layout.svelte-558cccca.js.map

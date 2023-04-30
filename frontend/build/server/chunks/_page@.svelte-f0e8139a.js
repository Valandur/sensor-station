import { c as create_ssr_component } from './index3-3b5a9ccf.js';

const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `${$$result.head += `<!-- HEAD_svelte-1g42t4a_START --><base href="https://www.srf.ch/"><!-- HTML_TAG_START -->${data.head}<!-- HTML_TAG_END --><!-- HEAD_svelte-1g42t4a_END -->`, ""}

<!-- HTML_TAG_START -->${data.main}<!-- HTML_TAG_END -->

<!-- HTML_TAG_START -->${data.scripts}<!-- HTML_TAG_END -->`;
});

export { Page as default };
//# sourceMappingURL=_page@.svelte-f0e8139a.js.map

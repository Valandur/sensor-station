import { c as create_ssr_component } from './ssr-z3nJZMSi.js';

const css = {
  code: "html,body{margin:0;padding:0;font-size:32px}.main.svelte-twlnpi{padding:0.5em}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let simple;
  let head;
  let body;
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css);
  simple = data.simple;
  head = data.article.head;
  body = data.article.body;
  return `${$$result.head += `<!-- HEAD_svelte-1rtpznj_START -->${!simple ? `<base href="https://www.srf.ch/"> <!-- HTML_TAG_START -->${head}<!-- HTML_TAG_END -->` : ``}<!-- HEAD_svelte-1rtpznj_END -->`, ""} <div class="main svelte-twlnpi"><!-- HTML_TAG_START -->${body}<!-- HTML_TAG_END --> </div>`;
});

export { Page as default };
//# sourceMappingURL=_page@.svelte-kIEDTjv9.js.map
